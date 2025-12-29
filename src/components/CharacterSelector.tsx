import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NOIR_COLORS } from '../constants/noirTheme';

interface CharacterSelectorProps {
  character: string;
  count: number;
  onChange: (count: number) => void;
  description: string;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  character, 
  count, 
  onChange, 
  description 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{character}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.controls}>
        <Button
          mode="outlined"
          onPress={() => onChange(Math.max(0, count - 1))}
          style={styles.button}
        >
          −
        </Button>
        <Text style={styles.count}>{count}</Text>
        <Button
          mode="outlined"
          onPress={() => onChange(count + 1)}
          style={styles.button}
        >
          +
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NOIR_COLORS.darkBorder,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: NOIR_COLORS.neonBlue,
  },
  description: {
    fontSize: 12,
    color: NOIR_COLORS.mutedText,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  button: {
    minWidth: 40,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 30,
    textAlign: 'center',
    color: NOIR_COLORS.neonRed,
  },
});
