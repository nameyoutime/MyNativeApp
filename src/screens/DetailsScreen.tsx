import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails } from '../api/tmdb';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '../redux/slices/watchlistSlice';
import ChevronLeftIcon from '../assets/icons/ChevronLeftIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Movie } from '../types/movie';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLogo from '../components/AppLogo';
import WatchListIconSmall from '../assets/icons/WatchListIconSmall';
import UserScoreCircle from '../components/UserScoreCircle';
import { HomeStackParamList, WatchlistStackParamList } from '../navigation/types';

type DetailsScreenRouteProp = RouteProp<HomeStackParamList | WatchlistStackParamList, 'Details'>;

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList | WatchlistStackParamList,
  'Details'
>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { movie } = route.params;

  // Watchlist check
  const watchlist = useAppSelector(state => state.watchlist.items);
  const isInWatchlist = watchlist.some(m => m.id === movie.id);

  const { data: details, isLoading } = useQuery({
    queryKey: ['movieDetails', movie.id],
    queryFn: () => fetchMovieDetails(movie.id),
  });

  const handleWatchlistPress = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist(movie));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#01b4e4" />
      </View>
    );
  }

  // Extract needed data
  const director = details?.credits.crew.find(c => c.job === 'Director');
  const writers =
    details?.credits.crew.filter(c => c.department === 'Writing').slice(0, 2) ||
    [];
  const certification =
    details?.release_dates?.results.find(r => r.iso_3166_1 === 'US')
      ?.release_dates[0]?.certification || 'NR';
  const runtime = details
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : '';
  const genres = details?.genres.map(g => g.name).join(', ') || '';

  // Cast and Recs
  const cast = details?.credits.cast.slice(0, 10) || [];
  const recommendations = details?.recommendations.results || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView bounces={false}>
        {/* app logo */}
        <AppLogo />
        {/* Header Section (Blue Background) */}
        <View style={styles.headerContainer}>
          <View style={styles.containerInfo}>
            {/* Navigation Bar Area inside Header */}
            <View style={styles.navBar}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ padding: 10 }}
              >
                <ChevronLeftIcon />
              </TouchableOpacity>
              <Text style={styles.navTitle} numberOfLines={1}>
                {movie.title} ({movie.release_date.split('-')[0]})
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.mainInfo}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
                style={styles.poster}
                resizeMode="cover"
              />
              <View style={styles.infoContent}>
                <View style={styles.metaRow}>
                  <View style={styles.certBadge}>
                    <Text style={styles.certText}>{certification}</Text>
                  </View>
                  <Text style={styles.metaText}>
                    {details?.release_date} • {runtime}
                  </Text>
                </View>
                <Text style={styles.metaText}>{genres}</Text>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status: </Text>
                  <Text style={styles.statusValue}>{details?.status}</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Original Language: </Text>
                  <Text style={styles.statusValue}>
                    {details?.original_language === 'en'
                      ? 'English'
                      : details?.original_language.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Score & Crew */}
          <View style={styles.statsSection}>
            <View style={styles.scoreContainer}>
              <UserScoreCircle score={Math.round(movie.vote_average * 10)} size={60} strokeWidth={4} />
              <Text style={styles.scoreLabel}>User Score</Text>
            </View>

            <View style={styles.crewContainer}>
              {director && (
                <View style={styles.crewItem}>
                  <Text style={styles.crewName}>{director.name}</Text>
                  <Text style={styles.crewJob}>Director</Text>
                </View>
              )}
              {writers.map((w, index) => (
                <View key={w.id + index} style={styles.crewItem}>
                  <Text style={styles.crewName}>{w.name}</Text>
                  <Text style={styles.crewJob}>{w.job}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tagline & Overview */}
          <View style={styles.overviewSection}>
            {details?.tagline && (
              <Text style={styles.tagline}>{details.tagline}</Text>
            )}
            <Text style={styles.overviewTitle}>Overview</Text>
            <Text style={styles.overviewText}>{movie.overview}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.watchlistButton}
              onPress={handleWatchlistPress}
            >
              <WatchListIconSmall />
              <Text style={styles.watchlistButtonText}>
                {isInWatchlist ? 'Remove From Watchlist' : 'Add To Watchlist'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cast Section */}
        {cast.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Top Billed Cast</Text>
            <FlatList
              horizontal
              data={cast}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.castCard}>
                  <Image
                    source={{
                      uri: item.profile_path
                        ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
                        : 'https://placehold.co/100x150/png',
                    }}
                    style={styles.castImage}
                  />
                  <View style={styles.castInfo}>
                    <Text style={styles.castName}>{item.name}</Text>
                    <Text style={styles.castRole}>{item.character}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </View>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <View style={styles.recContainer}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <FlatList
              horizontal
              data={recommendations}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recCard}
                  onPress={() => navigation.push('Details', { movie: item })}
                >
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w300${
                        item.backdrop_path || item.poster_path
                      }`,
                    }}
                    style={styles.recImage}
                  />
                  <View style={styles.recInfo}>
                    <Text style={styles.recTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.recRating}>
                      {Math.round(item.vote_average * 10)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 40,
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#00B4E4', // Adjust to match image gradient/color
  },
  containerInfo: {
    backgroundColor: '#0399c2',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  navTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mainInfo: {
    flexDirection: 'row',
    padding: 20,
  },
  poster: {
    width: 120,
    height: 150,
    borderRadius: 5,
  },
  infoContent: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  certBadge: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  certText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  metaText: {
    color: 'white',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 2,
    fontSize: 16,
  },
  statusLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusValue: {
    color: 'white',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  scoreContainer: {
    marginRight: 30,
    width: '45%',
  },

  scoreLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  crewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  crewItem: {
    marginRight: 20,
    marginBottom: 10,
  },
  crewName: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  crewJob: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tagline: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginBottom: 10,
    fontSize: 20,
  },
  overviewTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overviewText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  watchlistButton: {
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    gap: 10,
    marginTop: 34,
    marginBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'white', // Per image seems to have outline or specific style
  },
  watchlistButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  sectionContainer: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    marginLeft: 20,
    marginBottom: 15,
  },
  castCard: {
    width: 139,
    marginRight: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  castImage: {
    width: '100%',
    height: 154,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    backgroundColor: '#ccc',
    objectFit: 'cover',
  },
  castInfo: {
    padding: 10,
  },
  castName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  castRole: {
    fontSize: 16,
    color: '#666',
  },
  recContainer: {
    // with border width top
    marginTop: 35,
    borderTopWidth: 1,
    paddingTop: 25,
    borderColor: '#E4E4E4',
  },
  recCard: {
    width: 280,
    marginRight: 15,
    marginBottom: 10,
  },
  recImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  recInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  recTitle: {
    flex: 1,
    fontSize: 18,
    color: 'black',
  },
  recRating: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default DetailsScreen;
