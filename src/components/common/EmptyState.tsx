import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveFontSize } from '../../utils/responsive';

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'No data found.' }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    color: '#666',
    fontSize: responsiveFontSize(16),
    textAlign: 'center',
  },
});

export default EmptyState;
