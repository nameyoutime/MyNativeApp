import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import AppIcon from '../assets/icons/AppIcon';

const AppLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <AppIcon />
    </View>
  );
};

export default AppLogo;
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10, // status bar
  },
});
