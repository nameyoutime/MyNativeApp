import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import { responsiveFontSize } from '../../utils/responsive';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search...',
}: SearchBarProps) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSubmit}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    padding: 12,
    fontSize: responsiveFontSize(16),
    marginBottom: 16,
    fontWeight: '600',
    color: '#999999',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: responsiveFontSize(16),
  },
});

export default SearchBar;
