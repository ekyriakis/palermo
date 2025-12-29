# Night In Palermo - Setup & Development Guide

## Project Overview

Night In Palermo is a React Native Mafia game built with Expo. It's designed for iOS and Android and can be played on physical devices or simulators.

### Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **UI Library**: React Native Paper
- **Language**: TypeScript
- **Build Tool**: Expo

## Installation & Setup

### 1. Initial Project Setup (Already Done ✓)

The project was created with:
```bash
npx create-expo-app .
```

Dependencies installed:
```
- @react-navigation/native
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context
- react-native-gesture-handler
- react-native-reanimated
- react-native-paper
- uuid
```

### 2. Project Structure

```
nightinplaermo/
├── app/                              # Expo Router screens
│   ├── _layout.tsx                 # Root layout with GameProvider
│   ├── index.tsx                   # Home screen
│   ├── players.tsx                 # Add players
│   ├── characters.tsx              # Select characters
│   ├── reveal.tsx                  # Character reveal
│   └── game.tsx                    # Main game screen
│
├── src/
│   ├── context/
│   │   └── GameContext.tsx         # Global game state
│   ├── components/
│   │   ├── CharacterSelector.tsx   # Character count selector
│   │   ├── PlayerRevealCard.tsx    # Card for revealing character
│   │   └── PlayerGameCard.tsx      # Card for game screen
│   └── hooks/
│       └── useGameContext.ts       # Custom hook wrapper
│
├── assets/                         # App icons and images
├── constants/                      # App constants
├── hooks/                          # Other hooks
├── app.json                        # Expo configuration
└── package.json                    # Dependencies
```

## Game Logic Architecture

### Game Context (src/context/GameContext.tsx)

The game state is managed through React Context with the following structure:

**State Variables:**
- `players`: Array of Player objects
- `selectedCharacters`: Count of each character type
- `gameState`: 'setup' | 'character-reveal' | 'day' | 'night' | 'game-over'
- `currentPhase`: Day/Night phase number
- `isDay`: Boolean to track day/night
- `eliminatedPlayers`: Array of eliminated players
- `gameHistory`: Records of game results

**Main Actions:**
- `addPlayer(name)` - Add a new player
- `removePlayer(playerId)` - Remove a player
- `updateCharacterSelection(character, count)` - Set character counts
- `assignCharactersRandomly()` - Randomly assign characters to players
- `revealPlayerCharacter(playerId)` - Mark player as revealed
- `startGame()` - Begin the game
- `eliminatePlayer(playerId)` - Eliminate a player
- `nextPhase()` - Move to next day/night
- `resetGame()` - Reset to setup

### Player Object Structure

```typescript
interface Player {
  id: string;              // Unique ID
  name: string;            // Player name
  character: string | null; // 'Civilian', 'Killer 1', 'Killer 2', 'Cop'
  hasRevealed: boolean;    // Has this player revealed their character?
  isAlive: boolean;        // Alive in current game?
  role: string | null;     // 'civilian' | 'killer' | 'cop'
}
```

## Screen Flows

### 1. Home Screen (index.tsx)
- Displays game intro and rules
- Button to start new game
- Resets game state

### 2. Players Screen (players.tsx)
- Input field to add player names
- List of added players with delete option
- Continue button (disabled until 3+ players)

### 3. Characters Screen (characters.tsx)
- Selectors for each character type
- Shows total count (must match player count)
- Assigns characters randomly

### 4. Reveal Screen (reveal.tsx)
- Each player double-taps their name to reveal their character
- Shows progress (X/Y players revealed)
- Start Game button when all revealed

### 5. Game Screen (game.tsx)
- Shows current phase (Day/Night)
- Player stats (alive, killers, town)
- List of alive players
- Vote/eliminate during day
- Next phase button during night
- Game over screen with results

## Running the Application

### Option 1: Web (Development/Testing)
```bash
npm run web
```
- Opens at `http://localhost:8081`
- Good for quick testing
- Uses web browser

### Option 2: Android Emulator
```bash
npm run android
```
- Requires Android SDK and emulator setup
- Builds and runs on Android emulator

### Option 3: iOS Simulator (macOS only)
```bash
npm run ios
```
- Requires macOS and Xcode
- Runs on iOS simulator

### Option 4: Physical Device (Recommended)
```bash
npm start
```
Then:
- **Android**: Scan QR code with Expo Go app
- **iOS**: Scan QR code with Camera app, tap Expo Go link

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:**
```bash
npm install
npm start -- -c  # Clear cache
```

### Issue: TypeScript errors
**Solution:**
```bash
npx tsc --noEmit  # Check for errors
```

### Issue: Port 8081 already in use
**Solution:**
```bash
npm start -- --port 3000
# Or kill the process using port 8081
```

### Issue: Changes not reflecting
**Solution:**
1. Clear cache: Press `c` in Expo CLI
2. Refresh app: Pull down on iOS/Android
3. Restart dev server: Ctrl+C then `npm start`

## Customization Guide

### Adding a New Character Type

1. Update `GameContext.tsx`:
```typescript
export const CHARACTERS = {
  CIVILIAN: 'Civilian',
  KILLER1: 'Killer 1',
  KILLER2: 'Killer 2',
  COP: 'Cop',
  LAWYER: 'Lawyer', // New!
};
```

2. Update `CHARACTER_ROLES` if it has unique mechanics:
```typescript
export const CHARACTER_ROLES = {
  CIVILIAN: 'civilian',
  KILLER: 'killer',
  COP: 'cop',
  LAWYER: 'lawyer', // New!
};
```

3. Update `getRole()` function to handle new character
4. Character will automatically appear in the character selector

### Changing Colors/Theme

Edit `app/_layout.tsx`:
```typescript
<Stack
  screenOptions={{
    headerStyle: {
      backgroundColor: '#667eea', // Change this
    },
    headerTintColor: '#fff',
  }}
>
```

Or edit individual screen stylesheets.

### Adding Game Phases

The game currently supports Day/Night cycles. To add more phases:

1. Update `gameState` type in GameContext
2. Modify `nextPhase()` logic
3. Add new screen or update Game screen accordingly

## Development Workflow

### 1. Creating a New Screen
```bash
# Create new file in app/
# app/new-screen.tsx
```

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useGameContext } from '@/src/hooks/useGameContext';

export default function NewScreen() {
  const router = useRouter();
  const gameContext = useGameContext();

  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
      <Button onPress={() => router.push('/next-screen')}>
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
});
```

### 2. Creating a New Component
```bash
# Create file in src/components/
# src/components/NewComponent.tsx
```

### 3. Using Game Context
```typescript
const { players, addPlayer } = useGameContext();
```

## Testing Tips

### Test Scenarios
1. **2 Players**: Should show error (minimum 3)
2. **Character Mismatch**: Selection must equal player count
3. **Win Condition - Town**: Eliminate all killers
4. **Win Condition - Killers**: Killers ≥ Town

### Manual Testing Steps
1. Create game with 5 players
2. Select 3 Civilians, 2 Killers (1 Cop optional)
3. All reveal characters
4. Day 1: Vote eliminate a random player
5. Night 1: Move to next phase
6. Continue until win condition

## Performance Considerations

- Game state updates efficiently with `useCallback`
- Components use `React.FC` for proper typing
- No unnecessary re-renders with context optimization
- UUID used for unique player IDs

## Next Steps for Enhancement

1. **Add Night Phase UI**: Show only killers during night
2. **Add Chat System**: In-game communication
3. **Add Sound Effects**: Audio feedback
4. **Add Animations**: Screen transitions and reveals
5. **Add Notifications**: Alerts for game events
6. **Add Statistics**: Track wins/losses per player
7. **Add Themes**: Dark mode, custom colors
8. **Add Multiplayer**: Online play capability

## Troubleshooting Commands

```bash
# Clear all caches
npm start -- -c

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npx tsc --noEmit

# Check for console errors
npm run web  # Check browser console

# Reset Expo
expo login
expo logout
```

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy developing! 🚀**
