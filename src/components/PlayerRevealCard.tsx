import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { NOIR_COLORS } from '../constants/noirTheme';
import { useGameContext } from '../hooks/useGameContext';

interface Player {
  id: string;
  name: string;
  character: string | null;
  hasRevealed: boolean;
  isAlive: boolean;
  role: string | null;
}

interface PlayerRevealCardProps {
  player: Player;
}

export const PlayerRevealCard: React.FC<PlayerRevealCardProps> = ({ player }) => {
  const { revealPlayerCharacter, players, CHARACTERS, CHARACTER_ROLES } = useGameContext();
  const [showModal, setShowModal] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (showModal && !hasOpened) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [showModal, hasOpened]);

  const handleDoubleTap = () => {
    if (!hasOpened && !player.hasRevealed) {
      setShowModal(true);
      setHasOpened(true);
      revealPlayerCharacter(player.id);
    }
  };

  // Get killer names for Killers and Cops to see
  const getKillerInfo = () => {
    const killers = players.filter((p: any) => p.role === CHARACTER_ROLES.KILLER && p.character);
    return killers.map((k: any) => k.name).join(' and ');
  };

  const getCharacterImage = () => {
    if (player.character === CHARACTERS.CIVILIAN) {
      return require('@/src/assets/palermo-civilian.svg');
    } else if (player.character === CHARACTERS.COP) {
      return require('@/src/assets/palermo-cop.svg');
    } else if (player.character === CHARACTERS.KILLER1) {
      return require('@/src/assets/palermo-killer1.svg');
    } else if (player.character === CHARACTERS.KILLER2) {
      return require('@/src/assets/palermo-killer2.svg');
    }
    return null;
  };

  const getModalContent = () => {
    let content = `Είστε ${player.character}`;
    
    if (player.role === CHARACTER_ROLES.KILLER) {
      const otherKillers = players.filter((p: any) => 
        p.role === CHARACTER_ROLES.KILLER && p.id !== player.id && p.character
      );
      if (otherKillers.length > 0) {
        content += `\n\nΟ συνεργάτης σας: ${otherKillers.map((k: any) => k.name).join(' και ')}`;
      }
    } else if (player.role === CHARACTER_ROLES.COP) {
      const killerOne = players.find((p: any) => p.character === CHARACTERS.KILLER1);
      if (killerOne) {
        content += `\n\nΦανερός Δολοφόνος: ${killerOne.name}`;
      }
    }
    
    return content;
  };

  return (
    <>
      <TouchableOpacity 
        onPress={handleDoubleTap}
        delayPressIn={0}
        activeOpacity={0.7}
        disabled={hasOpened}
      >
        <View style={[
          styles.card,
          player.hasRevealed && styles.revealed,
          hasOpened && styles.opened
        ]}>
          <View style={styles.content}>
            <Text style={styles.name}>{player.name}</Text>
            {player.hasRevealed ? (
              <View style={styles.characterContainer}>
                <Text style={styles.character}>
                  ✓ Αποκάλυψη
                </Text>
              </View>
            ) : (
              <Text style={styles.placeholder}>
                (Διπλό κλικ για αποκάλυψη)
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ρόλος του {player.name}</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              />
            </View>

            <View style={styles.modalBody}>
              {getCharacterImage() && (
                <Image
                  source={getCharacterImage()}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.modalText}>{getModalContent()}</Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeModalButtonText}>Κλείσιμο</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: NOIR_COLORS.darkBorder,
  },
  revealed: {
    backgroundColor: '#1a3a1a',
    borderColor: NOIR_COLORS.neonGreen,
  },
  opened: {
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: NOIR_COLORS.lightText,
  },
  characterContainer: {
    backgroundColor: NOIR_COLORS.darkBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: NOIR_COLORS.neonGreen,
  },
  character: {
    fontSize: 14,
    fontWeight: '500',
    color: NOIR_COLORS.neonGreen,
  },
  placeholder: {
    fontSize: 12,
    color: NOIR_COLORS.mutedText,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: NOIR_COLORS.shadowDeep,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: NOIR_COLORS.darkCard,
    borderRadius: 12,
    padding: 0,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: NOIR_COLORS.neonRed,
    elevation: 5,
    shadowColor: NOIR_COLORS.neonRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: NOIR_COLORS.neonRed,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NOIR_COLORS.neonRed,
  },
  closeButton: {
    margin: 0,
    color: '#ff9500',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  cardImage: {
    width: 200,
    height: 280,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: NOIR_COLORS.lightText,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    color: NOIR_COLORS.mutedText,
    marginBottom: 12,
  },
  closeModalButton: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 6,
    width: '100%',
  },
  closeModalButtonText: {
    color: NOIR_COLORS.darkBg,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
