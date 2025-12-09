import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';
import { removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { Movie } from '../types/movie';
import { fetchAccountDetails } from '../api/tmdb';
import ChevronLeftIcon from '../assets/icons/ChevronLeftIcon';
import AppLogo from '../components/AppLogo';
import { watchlistStyles as styles } from '../styles/watchlistStyles';
import WatchlistCard from '../components/common/WatchlistCard';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';

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
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const loadUser = async () => {
    setLoadingUser(true);
    setUserError(null);
    try {
      const data = await fetchAccountDetails();
      if (data) {
        setUser(data);
      }
    } catch (e) {
      setUserError("Failed to load user profile.");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
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

  const renderItem = ({ item }: { item: Movie }) => (
    <WatchlistCard 
      movie={item} 
      onPress={handlePressMovie} 
      onRemove={handleRemove} 
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppLogo />
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <ChevronLeftIcon width={24} height={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
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
            {userError && <Text style={{color: 'orange', fontSize: 12}}>Could not refresh profile</Text>}
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
            <EmptyState message="Your watchlist is empty." />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default WatchlistScreen;
