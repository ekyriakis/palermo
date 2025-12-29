# 🌙 Night In Palermo - React Native Mafia Game

A thrilling Mafia-style game built with React Native and Expo. Citizens must identify and eliminate the hidden killers before they're all eliminated!

## Features

✨ **Create New Games** - Start a fresh game anytime  
👥 **Add Players** - Invite friends by name  
🎭 **Random Character Assignment** - Fairly distribute roles (Civilians, Killers, Cop)  
🔒 **Secret Reveal** - Players double-tap to privately reveal their character  
📋 **Day/Night Phases** - Vote during the day, killers plot at night  
🎯 **Vote to Eliminate** - Democratic elimination of suspects  
🏆 **Win Conditions** - Town wins if all killers eliminated, Killers win if they equal town  

## Game Roles

- **Civilian** (👥): Work with town to find killers
- **Killer 1** (🔪): Work together to eliminate townspeople  
- **Killer 2** (🔪): Work together to eliminate townspeople  
- **Cop** (🛡️): Can protect one player each night (enhanced townsperson)

## Gameplay Flow

1. **Setup**: Add all players and select which characters to include
2. **Character Reveal**: Each player sees only their own secret role
3. **Day Phase**: All players vote to eliminate a suspect
4. **Reveal**: The eliminated player's role is revealed to everyone
5. **Night Phase**: Killers secretly choose who to eliminate (only they know)
6. **Repeat**: Continue until either all killers are eliminated (Town wins) or killers equal/outnumber town (Killers win)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- iOS Simulator (for macOS) or Android Emulator
- Or the Expo Go app on your phone

### Installation

```bash
cd nightinplaermo
npm install
```

### Running the App

**Web (for testing):**
```bash
npm run web
```
Opens in your browser at `http://localhost:8081`

**Android Emulator:**
```bash
npm run android
```

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Physical Device (using Expo Go):**
```bash
npm start
```
Scan the QR code with Expo Go app (Android) or Camera (iOS)

## Project Structure

```
nightinplaermo/
├── app/                          # Screens (Expo Router)
│   ├── _layout.tsx             # Main navigation setup
│   ├── index.tsx               # Home screen
│   ├── players.tsx             # Add players screen
│   ├── characters.tsx          # Select characters screen
│   ├── reveal.tsx              # Character reveal screen
│   └── game.tsx                # Main game screen
├── src/
│   ├── context/
│   │   └── GameContext.tsx     # Global game state & logic
│   ├── components/
│   │   ├── CharacterSelector.tsx
│   │   ├── PlayerRevealCard.tsx
│   │   └── PlayerGameCard.tsx
│   └── hooks/
│       └── useGameContext.ts   # Custom hook for game context
├── app.json                    # Expo configuration
├── package.json
└── tsconfig.json
```

## Key Technologies

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and build service
- **Expo Router** - File-based routing
- **React Native Paper** - Material Design UI components
- **TypeScript** - Type-safe JavaScript
- **UUID** - Unique ID generation

## How to Play

### Starting a Game
1. Tap **"Start New Game"** from home screen
2. Add all players' names
3. Choose character distribution (minimum 3 players)
4. Each player double-taps their name to secretly see their role
5. Once all revealed, tap **"Start Game"**

### During the Game
- **Day Phase**: Vote to eliminate a player by tapping their name and confirming
- **Night Phase**: Killers secretly discuss and eliminate someone (tap "Next Phase" when ready)
- **After Elimination**: Eliminated player's role is revealed
- **Win/Lose**: Game ends when conditions are met

## Tips for Great Games

💡 **Discussion**: Make the day phases exciting with debate!  
🤐 **Keep Secrets**: Don't reveal your role (except when voting)  
🎭 **Bluff**: Act innocent if you're a killer, act suspiciously if you're town  
📊 **Pay Attention**: Watch who votes for whom to find patterns  
⚖️ **Balance**: More killers = harder for town; more cops = easier  

## Customization

### Add More Characters
Edit `src/context/GameContext.tsx` to add custom roles:
```typescript
export const CHARACTERS = {
  CIVILIAN: 'Civilian',
  KILLER1: 'Killer 1',
  KILLER2: 'Killer 2',
  COP: 'Cop',
  // Add more here
};
```

### Change Themes
Modify colors in the component StyleSheets or in `_layout.tsx`

## Future Enhancements

- 🎮 Single device game mode (pass phone around)
- 💬 In-game chat system
- 🔔 Sound effects and notifications
- 📱 Multiplayer online support
- 📊 Game statistics and leaderboard
- 🎨 Custom themes and skins
- 🌍 Multi-language support

## Troubleshooting

**App won't start:**
```bash
npm install  # Reinstall dependencies
npm start    # Clear cache if needed
```

**Port already in use:**
```bash
# Kill process using port 8081
# Or use: npm start -- --port 3000
```

**Missing dependencies:**
```bash
npm install uuid @react-navigation/native react-native-paper
```

## License

MIT License - Feel free to modify and distribute

## Contributing

Feel free to submit issues, forks, and pull requests!

---

**Enjoy the game! 🎉 Good luck eliminating those killers!**
