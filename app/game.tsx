import { PlayerGameCard } from '@/src/components/PlayerGameCard';
import { NOIR_COLORS } from '@/src/constants/noirTheme';
import { useGameContext } from '@/src/hooks/useGameContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function GameScreen() {
  const router = useRouter();
  const {
    players,
    gameState,
    isDay,
    currentPhase,
    eliminatePlayer,
    nextPhase,
    resetGame,
    resetGameKeepPlayers,
    CHARACTER_ROLES,
  } = useGameContext();
  
  console.log('GameScreen rendered, gameState:', gameState, 'isDay:', isDay, 'players:', players.length);
  console.log('Phase:', isDay ? 'Day' : 'Night', currentPhase);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const alivePlayers = players.filter((p: any) => p.isAlive);
  const killers = players.filter((p: any) => p.role === CHARACTER_ROLES.KILLER && p.isAlive);
  const townspeople = players.filter((p: any) => 
    (p.role === CHARACTER_ROLES.CIVILIAN || p.role === CHARACTER_ROLES.COP) && p.isAlive
  );

  const [eliminationMessage, setEliminationMessage] = useState<string | null>(null);
  const [showEliminationAlert, setShowEliminationAlert] = useState(false);

  const handleEliminate = (playerId: string) => {
    const player = players.find((p: any) => p.id === playerId);
    if (!player) {
      console.log('Player not found!');
      return;
    }

    console.log('Eliminating player:', playerId, player.name);
    eliminatePlayer(playerId);
    
    // On day phase, show the character. On night phase, don't reveal it
    const message = isDay 
      ? `${player.name} was a ${player.character}`
      : `${player.name} has been eliminated`;
    
    setEliminationMessage(message);
    setShowEliminationAlert(true);
    
    // Auto-proceed after 2 seconds
    setTimeout(() => {
      console.log('Auto-proceeding to next phase...');
      setSelectedPlayer(null);
      setShowEliminationAlert(false);
      setEliminationMessage(null);
      nextPhase();
    }, 2000);
  };

  const handleGameOver = () => {
    resetGame();
    router.replace('/');
  };

  const handlePlayAgain = () => {
    resetGameKeepPlayers();
    router.replace('/characters');
  };

  if (gameState === 'game-over') {
    const winners = killers.length > 0 ? '🔪 Δολοφόνοι' : '👥 Πόλη';
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Τέλος Παιχνιδιού!</Text>
          <Text style={styles.winnerText}>{winners} Κέρδισαν!</Text>
        </View>
        
        <View style={styles.finalStatsContainer}>
          <Text style={styles.statsTitle}>Τελικά Αποτελέσματα</Text>
          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[
                styles.playerResult,
                !item.isAlive && styles.eliminatedResult
              ]}>
                <Text style={styles.playerResultName}>{item.name}</Text>
                <View style={styles.playerResultInfo}>
                  <Text style={styles.playerResultRole}>{item.character}</Text>
                  {!item.isAlive && (
                    <Text style={styles.eliminatedLabel}>Εξαλείφθη</Text>
                  )}
                </View>
              </View>
            )}
          />
        </View>

        <View style={styles.finalButtonContainer}>
          <Button 
            mode="contained" 
            onPress={handlePlayAgain}
            style={styles.finalButton}
          >
            Παίξτε Ξανά με τους Ίδιους Παίκτες
          </Button>
          <Button 
            mode="outlined" 
            onPress={handleGameOver}
            style={styles.finalButton}
          >
            Νέο Παιχνίδι
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Elimination Alert Overlay */}
      {showEliminationAlert && eliminationMessage && (
        <View style={styles.eliminationOverlay}>
          <View style={styles.eliminationBox}>
            <Text style={styles.eliminationTitle}>Eliminated!</Text>
            <Text style={styles.eliminationMessage}>{eliminationMessage}</Text>
            <Text style={styles.eliminationSubtext}>Proceeding to next phase...</Text>
          </View>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.title}>
          {isDay ? '☀️ Μέρα' : '🌙 Νύχτα'} {currentPhase}
        </Text>
        <Text style={styles.phase}>
          {isDay 
            ? 'Όλοι ψηφίζουν για εξάλειψη κάποιου' 
            : 'Οι δολοφόνοι επιλέγουν κρυφά το θύμα τους'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Ζώντες</Text>
          <Text style={styles.statValue}>{alivePlayers.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>🔪</Text>
          <Text style={styles.statValue}>{killers.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>👥</Text>
          <Text style={styles.statValue}>{townspeople.length}</Text>
        </View>
      </View>

      <ScrollView style={styles.playersContainer}>
        <FlatList
          data={alivePlayers}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <PlayerGameCard
              player={item}
              isSelected={selectedPlayer === item.id}
              onPress={() => setSelectedPlayer(item.id)}
              showCharacter={false}
            />
          )}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        {isDay && selectedPlayer && (
          <>
            <Button 
              mode="outlined" 
              onPress={() => {
                console.log('Cancel button pressed');
                setSelectedPlayer(null);
              }}
              style={styles.button}
            >
              Ακύρωση
            </Button>
            <Button 
              mode="contained" 
              onPress={() => {
                console.log('Eliminate button pressed, selectedPlayer:', selectedPlayer);
                handleEliminate(selectedPlayer);
              }}
              style={styles.button}
            >
              Ψήφος Εξάλειψης
            </Button>
          </>
        )}
        {!isDay && selectedPlayer && (
          <>
            <Button 
              mode="outlined" 
              onPress={() => {
                console.log('Cancel button pressed');
                setSelectedPlayer(null);
              }}
              style={styles.button}
            >
              Ακύρωση
            </Button>
            <Button 
              mode="contained" 
              onPress={() => {
                console.log('Killers eliminate button pressed, selectedPlayer:', selectedPlayer);
                handleEliminate(selectedPlayer);
              }}
              style={styles.button}
            >
              Εξάλειψη Στόχου
            </Button>
          </>
        )}
        {!isDay && !selectedPlayer && (
          <Button 
            mode="contained" 
            onPress={() => {
              console.log('Next Phase button pressed');
              nextPhase();
            }}
            style={styles.fullButton}
          >
            Τέλος Νύχτας (Παράλειψη Επιλογής)
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: NOIR_COLORS.darkBg,
  },
  eliminationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  eliminationBox: {
    backgroundColor: NOIR_COLORS.darkCard,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderColor: NOIR_COLORS.neonRed,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eliminationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: NOIR_COLORS.neonRed,
  },
  eliminationMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: NOIR_COLORS.lightText,
  },
  eliminationSubtext: {
    fontSize: 14,
    color: NOIR_COLORS.mutedText,
    fontStyle: 'italic',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: NOIR_COLORS.darkBorder,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: NOIR_COLORS.neonRed,
  },
  phase: {
    color: NOIR_COLORS.mutedText,
    marginTop: 5,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  stat: {
    flex: 1,
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderTopColor: NOIR_COLORS.neonBlue,
    borderTopWidth: 2,
  },
  statLabel: {
    fontSize: 12,
    color: NOIR_COLORS.mutedText,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NOIR_COLORS.neonBlue,
  },
  playersContainer: {
    flex: 1,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  fullButton: {
    flex: 1,
  },
  gameOverContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: NOIR_COLORS.neonRed,
  },
  winnerText: {
    fontSize: 28,
    fontWeight: '600',
    color: NOIR_COLORS.neonGreen,
  },
  finalStatsContainer: {
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderTopColor: NOIR_COLORS.neonGreen,
    borderTopWidth: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: NOIR_COLORS.lightText,
  },
  playerResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: NOIR_COLORS.darkCard,
    marginVertical: 4,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: NOIR_COLORS.neonBlue,
  },
  eliminatedResult: {
    opacity: 0.6,
    borderLeftColor: NOIR_COLORS.neonRed,
  },
  playerResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: NOIR_COLORS.lightText,
  },
  playerResultInfo: {
    alignItems: 'flex-end',
  },
  playerResultRole: {
    fontSize: 14,
    color: NOIR_COLORS.neonBlue,
  },
  eliminatedLabel: {
    fontSize: 12,
    color: NOIR_COLORS.neonRed,
    marginTop: 2,
  },
  finalButtonContainer: {
    marginBottom: 20,
  },
  finalButton: {
    paddingVertical: 8,
  },
});
