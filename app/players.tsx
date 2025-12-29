import { NOIR_COLORS } from '@/src/constants/noirTheme';
import { useGameContext } from '@/src/hooks/useGameContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';

export default function PlayersScreen() {
  const router = useRouter();
  const { players, addPlayer, removePlayer } = useGameContext();
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (playerName.trim() === '') {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }
    addPlayer(playerName.trim());
    setPlayerName('');
  };

  const handleContinue = () => {
    if (players.length < 3) {
      Alert.alert('Error', 'You need at least 3 players');
      return;
    }
    router.push('/characters');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Προσθέστε Παίκτες</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          label="Όνομα Παίκτη"
          value={playerName}
          onChangeText={setPlayerName}
          mode="outlined"
          style={styles.input}
          placeholder="Εισάγετε όνομα παίκτη"
          onSubmitEditing={handleAddPlayer}
        />
        <Button 
          mode="contained" 
          onPress={handleAddPlayer}
          style={styles.addButton}
        >
          Προσθήκη
        </Button>
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.count}>Παίκτες Προστέθηκαν: {players.length}</Text>
      </View>

      <View style={styles.listContainer}>
        {players.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Δεν έχουν προστεθεί παίκτες. Προσθέστε παίκτες για να συνεχίσετε.</Text>
          </View>
        ) : (
          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            renderItem={({ item, index }) => (
              <View style={styles.playerItem}>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerNumber}>{index + 1}.</Text>
                  <Text style={styles.playerName}>{item.name}</Text>
                </View>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => removePlayer(item.id)}
                />
              </View>
            )}
          />
        )}
      </View>

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
          onPress={handleContinue}
          style={styles.button}
          disabled={players.length < 3}
        >
          Συνέχεια
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
    marginBottom: 20,
    color: NOIR_COLORS.neonRed,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
  },
  addButton: {
    justifyContent: 'center',
  },
  countContainer: {
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftColor: NOIR_COLORS.neonBlue,
    borderLeftWidth: 3,
  },
  count: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: NOIR_COLORS.lightText,
  },
  listContainer: {
    flex: 1,
    marginBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: NOIR_COLORS.mutedText,
    fontSize: 14,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: NOIR_COLORS.neonBlue,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerNumber: {
    fontWeight: '600',
    marginRight: 10,
    color: NOIR_COLORS.neonBlue,
  },
  playerName: {
    fontSize: 16,
    color: NOIR_COLORS.lightText,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
