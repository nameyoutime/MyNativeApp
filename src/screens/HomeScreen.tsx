import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  MovieCategory,
  setCategory,
  setSortBy,
  SortOption,
} from '../redux/slices/settingsSlice';
import { fetchMovies } from '../api/tmdb';
import { Movie, MovieResponse } from '../types/movie';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { useInfiniteQuery } from '@tanstack/react-query';
import AppLogo from '../components/AppLogo';
import ChevronRightIcon from '../assets/icons/ChevronRightIcon';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';

// ... (other imports remain the same, but remove useQuery if not used or keep both if needed, but we replace usage)
// I will keep the imports clean in the actual replacement block.

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MainTabs'
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
  }, [category]);

  const handleSearchPress = () => {
    setActiveSearchQuery(searchKeyword);
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

  const sortLabels: Record<SortOption, string> = {
    release_date: 'Release Date',
    rating: 'Rating',
    alphabetical: 'Alphabetical',
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movie: item })}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.poster}
        borderRadius={4}
      />
      <View style={styles.cardContent}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.movieDate}>{item.release_date}</Text>
        <Text style={styles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
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
            <Text style={styles.dropdownLabel}>
              Sort by {sortLabels[sortBy]}
            </Text>
            {sortOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
          {sortOpen && (
            <View style={styles.dropdownList}>
              {(['release_date', 'rating', 'alphabetical'] as SortOption[]).map(
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
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearchPress}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
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
              <Text
                style={{ textAlign: 'center', marginTop: 20, color: '#666' }}
              >
                No movies found.
              </Text>
            }
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  controls: {
    paddingHorizontal: 29,
    paddingBottom: 45,
    zIndex: 10, // Ensure dropdowns float above if absolute positioned (though here handled via layout flows)
  },
  dropdownContainer: {
    marginBottom: 15,
    backgroundColor: '##E3E3E3',
    borderRadius: 4,
    // Shadow for dropdown container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  dropdownLabel: {
    fontSize: 16,
    // semibold
    fontWeight: '600',
    color: '#000000',
  },
  chevron: {
    fontSize: 12,
    color: '#333',
  },
  dropdownList: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dropdownItem: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemActive: {
    backgroundColor: '#01b4e4',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '600',
    color: '#999999',
    // Slight shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25, // Pill shape
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Slightly darker list bg
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // Card Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 160,
  },
  poster: {
    width: 106, // approx ~200/3 * 0.something, fitting aspect ratio
    height: '100%',
    backgroundColor: '#ddd',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  movieDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  movieOverview: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreButton: {
    width:'100%',
    backgroundColor: '#01b4e4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default HomeScreen;
