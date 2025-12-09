import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WatchlistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Watchlist Feature Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WatchlistScreen;
