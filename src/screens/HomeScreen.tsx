import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  MovieCategory,
  setCategory,
  setSortBy,
  SortOption,
} from '../redux/slices/settingsSlice';
import { fetchMovies } from '../api/tmdb';
import { Movie, MovieResponse } from '../types/movie';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import AppLogo from '../components/AppLogo';
import ChevronRightIcon from '../assets/icons/ChevronRightIcon';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';
import { HomeStackParamList } from '../navigation/types';
import { homeStyles as styles } from '../styles/homeStyles';
import MovieCard from '../components/common/MovieCard';
import SearchBar from '../components/common/SearchBar';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { category, sortBy } = useAppSelector(state => state.settings);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Accordion States
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Sorting Logic
  const sortMovies = useCallback(
    (list: Movie[]) => {
      const sorted = [...list];
      if (sortBy === null) {
        return sorted; // No sorting
      }
      switch (sortBy) {
        case 'alphabetical':
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'rating':
          sorted.sort((a, b) => b.vote_average - a.vote_average);
          break;
        case 'release_date':
          sorted.sort(
            (a, b) =>
              new Date(b.release_date).getTime() -
              new Date(a.release_date).getTime(),
          );
          break;
      }
      return sorted;
    },
    [sortBy],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<MovieResponse, Error>({
    queryKey: ['movies', category, activeSearchQuery],
    queryFn: ({ pageParam = 1 }) =>
      fetchMovies(category, activeSearchQuery, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const movies = React.useMemo(() => {
    if (!data) return [];
    const allMovies = data.pages.flatMap(page => page.results);
    return sortMovies(allMovies);
  }, [data, sortMovies]);

  useEffect(() => {
    setActiveSearchQuery('');
    setSearchKeyword('');
    // Reset sort to null when category changes
    dispatch(setSortBy(null));
  }, [category, dispatch]);

  const handleSearchPress = () => {
    setActiveSearchQuery(searchKeyword);
    // Reset sort to null when searching
    dispatch(setSortBy(null));
  };

  const toggleCategory = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCategoryOpen(!categoryOpen);
    setSortOpen(false); // Close others
  };

  const toggleSort = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSortOpen(!sortOpen);
    setCategoryOpen(false); // Close others
  };

  const categoryLabels: Record<MovieCategory, string> = {
    now_playing: 'Now Playing',
    upcoming: 'Upcoming',
    popular: 'Popular',
  };

  const sortLabels: Record<Exclude<SortOption, null>, string> = {
    release_date: 'Release Date',
    rating: 'Rating',
    alphabetical: 'Alphabetical',
  };

  const getSortDisplayText = () => {
    if (sortBy === null) return 'Sort by';
    return `Sort by ${sortLabels[sortBy]}`;
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      onPress={(m) => navigation.navigate('Details', { movie: m })}
    />
  );

  const renderFooter = () => {
    if (!hasNextPage) return <View style={{ height: 20 }} />;

    return (
      <View style={styles.footer}>
        {isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#01b4e4" />
        ) : (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={() => fetchNextPage()}
          >
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <AppLogo />
        <View style={styles.errorContainer}>
           <ErrorMessage 
              message={error instanceof Error ? error.message : "An error occurred while fetching movies."} 
              onRetry={() => refetch()}
           />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* app logo */}
      <AppLogo />

      <View style={styles.controls}>
        {/* Category Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleCategory}
          >
            <Text style={styles.dropdownLabel}>{categoryLabels[category]}</Text>
            {categoryOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
          {categoryOpen && (
            <View style={styles.dropdownList}>
              {(['now_playing', 'upcoming', 'popular'] as MovieCategory[]).map(
                cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.dropdownItem,
                      category === cat && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      dispatch(setCategory(cat));
                      toggleCategory();
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        category === cat && styles.dropdownItemTextActive,
                      ]}
                    >
                      {categoryLabels[cat]}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}
        </View>

        {/* Sort Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.dropdownHeader} onPress={toggleSort}>
            <Text style={styles.dropdownLabel}>{getSortDisplayText()}</Text>
            {sortOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
          {sortOpen && (
            <View style={styles.dropdownList}>
              {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map(
                opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.dropdownItem,
                      sortBy === opt && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      dispatch(setSortBy(opt));
                      toggleSort();
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        sortBy === opt && styles.dropdownItemTextActive,
                      ]}
                    >
                      {sortLabels[opt]}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}
        </View>

        {/* Search */}
        <SearchBar
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmit={handleSearchPress}
        />
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#01b4e4"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={movies}
            renderItem={renderMovie}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListEmptyComponent={
              <EmptyState message="No movies found." />
            }
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
