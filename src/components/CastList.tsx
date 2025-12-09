import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { responsiveFontSize } from '../utils/responsive';
import { ENV } from '../config/env';

interface CastListProps {
  cast: any[];
}

const CastList = ({ cast }: CastListProps) => {
  if (!cast || cast.length === 0) return null;

  return (
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
                  ? `${ENV.TMDB_IMAGE_BASE_URL}w200${item.profile_path}`
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
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 25,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
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
    fontSize: responsiveFontSize(14),
    color: 'black',
  },
  castRole: {
    fontSize: responsiveFontSize(16),
    color: '#666',
  },
});

export default CastList;
