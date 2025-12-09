import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Movie } from '../../types/movie';
import { responsiveFontSize } from '../../utils/responsive';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const MovieCard = ({ movie, onPress }: MovieCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }}
        style={styles.poster}
        borderRadius={4}
      />
      <View style={styles.cardContent}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {movie.title}
        </Text>
        <Text style={styles.movieDate}>{movie.release_date}</Text>
        <Text style={styles.movieOverview} numberOfLines={3}>
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
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 160,
  },
  poster: {
    width: 106,
    height: '100%',
    backgroundColor: '#ddd',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  movieDate: {
    fontSize: responsiveFontSize(12),
    color: '#999',
    marginBottom: 12,
  },
  movieOverview: {
    fontSize: responsiveFontSize(13),
    color: '#333',
    lineHeight: 18,
  },
});

export default MovieCard;
