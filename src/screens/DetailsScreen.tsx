import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { movie } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.date}>Released: {movie.release_date}</Text>
        <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}/10</Text>
        </View>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  poster: {
    width: '100%',
    height: 450,
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
  },
  ratingContainer: {
      marginBottom: 20,
      backgroundColor: '#333',
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
  },
  rating: {
    color: '#ffbf00',
    fontWeight: 'bold',
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
});

export default DetailsScreen;
