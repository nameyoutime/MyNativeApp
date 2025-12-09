import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/hooks';

export const UserInfo: React.FC = () => {
  const user = useAppSelector((state) => state.user);

  if (!user.isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to continue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user.username}!</Text>
      <Text style={styles.text}>User ID: {user.userId}</Text>
      <Text style={styles.text}>API Key: {user.apiKey}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
});