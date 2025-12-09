import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLogo from '../components/AppLogo';
import WatchListIconSmall from '../assets/icons/WatchListIconSmall';
import UserScoreCircle from '../components/UserScoreCircle';
import { detailsStyles as styles } from '../styles/detailsStyles';
import CastList from '../components/CastList';
import RecommendationList from '../components/RecommendationList';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  HomeStackParamList,
  WatchlistStackParamList,
} from '../navigation/types';
import { ENV } from '../config/env';

type DetailsScreenRouteProp = RouteProp<
  HomeStackParamList | WatchlistStackParamList,
  'Details'
>;

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

  const { data: details, isLoading, isError, error, refetch } = useQuery({
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

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
         <ErrorMessage 
           message={error instanceof Error ? error.message : "Failed to load movie details."} 
           onRetry={() => refetch()}
         />
      </View>
    );
  }

  // Extract needed data
  const director = details?.credits?.crew.find((c: any) => c.job === 'Director');
  const writers =
    details?.credits?.crew.filter((c: any) => c.department === 'Writing').slice(0, 2) ||
    [];
  const certification =
    details?.release_dates?.results.find((r: any) => r.iso_3166_1 === 'US')
      ?.release_dates[0]?.certification || 'NR';
  const runtime = details
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : '';
  const genres = details?.genres.map((g: any) => g.name).join(', ') || '';

  // Cast and Recs
  const cast = details?.credits?.cast.slice(0, 10) || [];
  const recommendations = details?.recommendations?.results || [];

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
                  uri: `${ENV.TMDB_IMAGE_BASE_URL}w500${movie.poster_path}`,
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
              <UserScoreCircle
                score={Math.round(movie.vote_average * 10)}
                size={60}
                strokeWidth={4}
              />
              <Text style={styles.scoreLabel}>User Score</Text>
            </View>

            <View style={styles.crewContainer}>
              {director && (
                <View style={styles.crewItem}>
                  <Text style={styles.crewName}>{director.name}</Text>
                  <Text style={styles.crewJob}>Director</Text>
                </View>
              )}
              {writers.map((w: any, index: number) => (
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
        <CastList cast={cast} />

        {/* Recommendations Section */}
        <RecommendationList 
          recommendations={recommendations} 
          onPress={(m) => navigation.push('Details', { movie: m })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;
