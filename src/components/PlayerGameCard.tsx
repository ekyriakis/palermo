import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

interface Player {
  id: string;
  name: string;
  character: string | null;
  hasRevealed: boolean;
  isAlive: boolean;
  role: string | null;
}

interface PlayerGameCardProps {
  player: Player;
  isSelected: boolean;
  onPress: () => void;
  showCharacter?: boolean;
}

export const PlayerGameCard: React.FC<PlayerGameCardProps> = ({ 
  player, 
  isSelected, 
  onPress, 
  showCharacter = true 
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.card,
        isSelected && styles.selected,
        !player.isAlive && styles.eliminated
      ]}>
        <Text style={[
          styles.name,
          !player.isAlive && styles.eliminatedText
        ]}>
          {player.name}
          {!player.isAlive && ' (Eliminated)'}
        </Text>
        {!player.isAlive && showCharacter && (
          <Text style={styles.character}>
            Was: {player.character}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  eliminated: {
    backgroundColor: '#ffebee',
    opacity: 0.7,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  eliminatedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  character: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
  },
});
