import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize } from '../utils/responsive';
import { Movie } from '../types/movie';
import { ENV } from '../config/env';

interface RecommendationListProps {
  recommendations: Movie[];
  onPress: (movie: Movie) => void;
}

const RecommendationList = ({ recommendations, onPress }: RecommendationListProps) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
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
            onPress={() => onPress(item)}
          >
            <Image
              source={{
                uri: `${ENV.TMDB_IMAGE_BASE_URL}w300${
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
  );
};

const styles = StyleSheet.create({
  recContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    paddingTop: 25,
    borderColor: '#E4E4E4',
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: '600',
    color: 'black',
    marginLeft: 20,
    marginBottom: 15,
  },
  recCard: {
    width: 280,
    marginRight: 15,
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
    fontSize: responsiveFontSize(18),
    color: 'black',
  },
  recRating: {
    marginLeft: 10,
    fontSize: responsiveFontSize(18),
  },
});

export default RecommendationList;
