/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ReduxProvider } from './src/redux/ReduxProvider';
import { useAppSelector, useAppDispatch } from './src/redux/hooks';
import { login, logout } from './src/redux/slices/userSlice';
import { ENV } from './src/config/env';
import { QueryProvider } from './src/api/QueryProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryProvider>
      <ReduxProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </SafeAreaProvider>
      </ReduxProvider>
    </QueryProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(login({ userId: '123', username: 'testuser' }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Slice with Local Storage</Text>
      <Text style={styles.info}>API Key: {ENV.TMDB_API_KEY}</Text>
      <Text style={styles.info}>
        Authenticated: {user.isAuthenticated ? 'Yes' : 'No'}
      </Text>
      {user.isAuthenticated && (
        <Text style={styles.info}>
          User: {user.username} (ID: {user.userId})
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        {!user.isAuthenticated ? (
          <Button title="Login" onPress={handleLogin} />
        ) : (
          <Button title="Logout" onPress={handleLogout} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
});

export default App;
