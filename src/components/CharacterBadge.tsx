import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CHARACTER_EMOJIS, NOIR_COLORS } from '../constants/noirTheme';

interface CharacterBadgeProps {
  character: string | null;
  role: string | null;
  isAlive?: boolean;
  size?: 'small' | 'medium' | 'large';
  CHARACTER_ROLES?: any;
}

export const CharacterBadge: React.FC<CharacterBadgeProps> = ({
  character,
  role,
  isAlive = true,
  size = 'medium',
  CHARACTER_ROLES,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: 20, containerSize: 40 };
      case 'large':
        return { fontSize: 40, containerSize: 80 };
      default:
        return { fontSize: 28, containerSize: 60 };
    }
  };

  const getCharacterEmoji = () => {
    if (!isAlive) return CHARACTER_EMOJIS.dead;
    if (role === CHARACTER_ROLES?.KILLER) return CHARACTER_EMOJIS.killer;
    if (role === CHARACTER_ROLES?.COP) return CHARACTER_EMOJIS.cop;
    return CHARACTER_EMOJIS.civilian;
  };

  const getBackgroundColor = () => {
    if (!isAlive) return '#1a1a1a';
    if (role === CHARACTER_ROLES?.KILLER) return '#3e1616';
    if (role === CHARACTER_ROLES?.COP) return '#163e32';
    return NOIR_COLORS.darkCard;
  };

  const getBorderColor = () => {
    if (!isAlive) return NOIR_COLORS.mutedText;
    if (role === CHARACTER_ROLES?.KILLER) return NOIR_COLORS.neonRed;
    if (role === CHARACTER_ROLES?.COP) return NOIR_COLORS.neonBlue;
    return NOIR_COLORS.darkBorder;
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyles.containerSize,
          height: sizeStyles.containerSize,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: sizeStyles.fontSize }]}>
        {getCharacterEmoji()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: NOIR_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  emoji: {
    fontWeight: '600',
  },
});
