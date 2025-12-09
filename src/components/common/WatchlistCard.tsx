import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Movie } from '../../types/movie';
import { ENV } from '../../config/env';
import { responsiveFontSize } from '../../utils/responsive';

interface WatchlistCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  onRemove: (id: number) => void;
}

const WatchlistCard = ({ movie, onPress, onRemove }: WatchlistCardProps) => {
  const date = new Date(movie.release_date);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: `${ENV.TMDB_IMAGE_BASE_URL}w200${movie.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => onRemove(movie.id)}
          >
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.releaseDate}>{formattedDate}</Text>
        <Text style={styles.overview} numberOfLines={2}>
          {movie.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
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
});

export default WatchlistCard;
