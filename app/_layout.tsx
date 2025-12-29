import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GameProvider } from '@/src/context/GameContext';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Noir theme colors
  const noirTheme = {
    dark: true,
    colors: {
      primary: '#1a1a2e',
      background: '#0f0f1e',
      card: '#16213e',
      text: '#eaeaea',
      border: '#2d3561',
      notification: '#ff6b6b',
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };

  return (
    <GameProvider>
      <ThemeProvider value={noirTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#ff6b6b',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#eaeaea',
              fontSize: 18,
            },
            contentStyle: {
              backgroundColor: '#0f0f1e',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ title: '🎭 Μια Νύχτα στο Παλέρμο', headerShown: true }} 
          />
          <Stack.Screen 
            name="players" 
            options={{ title: '👥 Προσθήκη Παικτών' }} 
          />
          <Stack.Screen 
            name="characters" 
            options={{ title: '🎪 Επιλογή Χαρακτήρων' }} 
          />
          <Stack.Screen 
            name="reveal" 
            options={{ title: '🔍 Αποκάλυψη Χαρακτήρων' }} 
          />
          <Stack.Screen 
            name="game" 
            options={{ 
              title: '⚔️ Παιχνίδι σε εξέλιξη',
              headerBackVisible: false
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </GameProvider>
  );
}
