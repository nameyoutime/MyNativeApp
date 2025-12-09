import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';
import { removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { Movie } from '../types/movie';
import { ENV } from '../config/env';
import { fetchAccountDetails } from '../api/tmdb';
import ChevronLeftIcon from '../assets/icons/ChevronLeftIcon';
import { responsiveFontSize } from '../utils/responsive';
import AppLogo from '../components/AppLogo';

// Mock types since we might not get full account details cleanly without logic
interface UserAccount {
  username: string;
  joined_at?: string; // TMDB account usually doesn't give joined date easily in v3, fake it
  avatar?: { gravatar?: { hash: string }; tmdb?: { avatar_path: string } };
}

type SortOption = 'alphabetical' | 'rating' | 'release_date';
type SortOrder = 'asc' | 'desc';

const sortOptions = [
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Rating', value: 'rating' },
  { label: 'Release Date', value: 'release_date' },
];

const WatchlistScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const watchlist = useSelector((state: RootState) => state.watchlist.items);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchAccountDetails();
      if (data) {
        setUser(data);
      }
    };
    loadUser();
  }, []);

  const handleRemove = (id: number) => {
    dispatch(removeFromWatchlist(id));
  };

  const handlePressMovie = (movie: Movie) => {
    navigation.navigate('Details', { movie: movie });
  };

  const sortedWatchlist = useMemo(() => {
    const sorted = [...watchlist];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = a.vote_average - b.vote_average;
          break;
        case 'release_date':
          comparison =
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [watchlist, sortOption, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const renderItem = ({ item }: { item: Movie }) => {
    // Format date: "19 July 2023"
    const date = new Date(item.release_date);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePressMovie(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: `${ENV.TMDB_IMAGE_BASE_URL}${item.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.releaseDate}>{formattedDate}</Text>
          <Text style={styles.overview} numberOfLines={2}>
            {item.overview}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppLogo />
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <ChevronLeftIcon width={24} height={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          {/* Logo could go here if needed, prompt image shows a big header with logo */}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'J'}
            </Text>
          </View>
          <View>
            <Text style={styles.username}>{user?.username || 'John Lee'}</Text>
            <Text style={styles.joinedDate}>Member since August 2023</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.screenTitle}>My Watchlist</Text>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={sortOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            value={sortOption}
            onChange={item => {
              setSortOption(item.value as SortOption);
            }}
            renderRightIcon={() => (
              <Text style={{ color: '#01b4e4', fontWeight: 'bold' }}>⌄</Text>
            )}
            itemTextStyle={{ color: '#000' }}
          />

          <Text style={styles.orderLabel}>Order:</Text>
          <TouchableOpacity onPress={toggleSortOrder}>
            {sortOrder === 'asc' ? (
              <Text style={styles.arrowIcon}>↑</Text>
            ) : (
              <Text style={styles.arrowIcon}>↓</Text>
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={sortedWatchlist}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Your watchlist is empty.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#042541',
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 10, // Adjust for status bar if needed
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9747FF', // Purple color from image
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: responsiveFontSize(36),
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
  },
  joinedDate: {
    // white but 70% opacity
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: responsiveFontSize(16),
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 10,
  },
  filterLabel: {
    fontSize: responsiveFontSize(16),
    color: '#828282',
    marginRight: 10,
  },
  orderLabel: {
    fontSize: responsiveFontSize(16),
    color: '#828282',
    marginLeft: 20,
    marginRight: 5,
  },
  dropdown: {
    width: 120,
    height: 30, // Small height
    borderBottomColor: '#01b4e4',
    borderBottomWidth: 2,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(16),
    color: '#01b4e4',
    fontWeight: '600',
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(16),
    color: '#01b4e4',
    fontWeight: '600',
  },
  arrowIcon: {
    fontSize: responsiveFontSize(20),
    color: '#000',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  poster: {
    width: 100,
    height: 146,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 21,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  movieTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    fontSize: responsiveFontSize(24),
    color: '#666',
    lineHeight: 24,
    marginTop: -5,
  },
  releaseDate: {
    fontSize: responsiveFontSize(14),
    color: '#999',
    marginBottom: 8,
  },
  overview: {
    fontSize: responsiveFontSize(14),
    color: '#333',
    lineHeight: 20,
    marginTop: 17,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: responsiveFontSize(16),
    color: '#666',
  },
});

export default WatchlistScreen;
