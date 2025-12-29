import { PlayerRevealCard } from '@/src/components/PlayerRevealCard';
import { NOIR_COLORS } from '@/src/constants/noirTheme';
import { useGameContext } from '@/src/hooks/useGameContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function RevealScreen() {
  const router = useRouter();
  const { 
    players, 
    allPlayersRevealed, 
    startGame,
  } = useGameContext();

  const handleStartGame = () => {
    if (!allPlayersRevealed()) {
      Alert.alert('Περιμένετε!', 'Όλοι οι παίκτες πρέπει να αποκαλύψουν τον χαρακτήρα τους!');
      return;
    }
    startGame();
    router.push('/game');
  };

  const unrevealed = players.filter((p: any) => !p.hasRevealed).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Δείτε τους χαρακτήρες σας</Text>
      
      <Text style={styles.subtitle}>
        Κάθε παίκτης: Διπλό κλικ στο Όνομά σας για αποκάλυψη του μυστικού ρόλου σας
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {players.length - unrevealed}/{players.length} παίκτες είδαν τον χαρακτήρα τους
        </Text>
        {unrevealed > 0 && (
          <Text style={styles.waitingText}>
            Αναμένουμε {unrevealed} ακόμη παίκτες...
          </Text>
        )}
      </View>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <PlayerRevealCard player={item} />
        )}
        style={styles.list}
      />

      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={() => router.back()}
          style={styles.button}
        >
          Πίσω
        </Button>
        <Button 
          mode="contained" 
          onPress={handleStartGame}
          style={styles.button}
          disabled={unrevealed > 0}
        >
          Έναρξη Παιχνιδιού
        </Button>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: NOIR_COLORS.neonRed,
  },
  subtitle: {
    marginBottom: 15,
    color: NOIR_COLORS.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  statusContainer: {
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: NOIR_COLORS.neonBlue,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: NOIR_COLORS.lightText,
  },
  waitingText: {
    fontSize: 12,
    color: NOIR_COLORS.neonRed,
    marginTop: 4,
  },
  list: {
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
});
