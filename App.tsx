import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/store/TaskContext';
import LoadingOverlay from './src/components/LoadingOverlay';
import { initAnalytics } from './src/services/analytics';

export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <SafeAreaProvider>
      <TaskProvider>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <AppNavigator />
          <LoadingOverlay />
        </View>
      </TaskProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
