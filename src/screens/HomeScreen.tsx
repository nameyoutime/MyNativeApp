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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { category, sortBy } = useAppSelector((state) => state.settings);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Sorting Logic
  const sortMovies = useCallback((list: Movie[]) => {
    const sorted = [...list];
    switch (sortBy) {
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        sorted.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'release_date':
        sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
    }
    return sorted;
  }, [sortBy]);

  const { data: movies = [], isLoading: loading, error } = useQuery<MovieResponse, Error, Movie[]>({
    queryKey: ['movies', category, activeSearchQuery],
    queryFn: () => fetchMovies(category, activeSearchQuery),
    select: (data) => sortMovies(data.results),
  });

  // When category changes, we might want to clear the search? 
  // For now, let's keep it simple. If user changes category, we persist the search query implies searching in that category?
  // But our API implementation prioritizes search query over category if query exists.
  // So if activeSearchQuery is set, category is effectively ignored by the API (except maybe for tracking).
  // The user requirement says: "trigger an API call to search for the list of movies with the specified category and search keyword."
  // TMDB Search API doesn't strictly support filtering by "Upcoming" + "Keyword". It searches global database.
  // So my implementation in tmdb.ts matches this limitation (prioritizes active search).
  
  // If user changes category, they probably expect to see that category's movies, so we should clear active search.
  useEffect(() => {
    setActiveSearchQuery('');
    setSearchKeyword('');
  }, [category]);

  const handleSearchPress = () => {
    setActiveSearchQuery(searchKeyword);
  };
  
  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movie: item })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.poster}
        borderRadius={8}
      />
      <View style={styles.cardContent}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieDate}>{item.release_date}</Text>
        <Text style={styles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        
      <View style={styles.header}>
          
        {/* Category Selector */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pillContainer}>
          {(['now_playing', 'upcoming', 'popular'] as MovieCategory[]).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, category === cat && styles.pillActive]}
              onPress={() => dispatch(setCategory(cat))}
            >
              <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
                {cat.replace('_', ' ').toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sort Selector */}
        <Text style={styles.label}>Sort By</Text>
        <View style={styles.pillContainer}>
           {(['alphabetical', 'rating', 'release_date'] as SortOption[]).map((opt) => (
             <TouchableOpacity
                key={opt}
                style={[styles.pill, styles.pillSmall, sortBy === opt && styles.pillActive]}
                onPress={() => dispatch(setSortBy(opt))}
             >
                <Text style={[styles.pillText, sortBy === opt && styles.pillTextActive]}>
                    {opt.replace('_', ' ').replace('by', '')}
                </Text>
             </TouchableOpacity>
           ))}
        </View>

        {/* Search Field */}
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor="#666"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearchPress}
          returnKeyType="search"
        />

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Movie List */}
      {loading ? (
        <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          inverted={false}
          ListEmptyComponent={
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
              No movies found.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  label: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 4,
  },
  pillContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  pillSmall: {
      paddingHorizontal: 10,
      paddingVertical: 4,
  },
  pillActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  pillText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pillTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieDate: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  movieOverview: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
  },
});

export default HomeScreen;
