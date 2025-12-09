/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/api/QueryProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ReduxProvider } from './src/redux/ReduxProvider';

function App() {
  return (
    <QueryProvider>
      <ReduxProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ReduxProvider>
    </QueryProvider>
  );
}

export default App;
