import { CharacterSelector } from '@/src/components/CharacterSelector';
import { NOIR_COLORS } from '@/src/constants/noirTheme';
import { useGameContext } from '@/src/hooks/useGameContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function CharactersScreen() {
  const router = useRouter();
  const { 
    players, 
    selectedCharacters, 
    updateCharacterSelection, 
    assignCharactersRandomly,
    CHARACTERS 
  } = useGameContext();

  const handleAssignCharacters = () => {
    const totalSelected = Object.values(selectedCharacters).reduce((a: number, b: any) => a + (b as number), 0);
    
    if (totalSelected !== players.length) {
      Alert.alert(
        'Ανταντιστοιχία Αριθμού Χαρακτήρων',
        `Επιλέξατε ${totalSelected} χαρακτήρες αλλά έχετε ${players.length} παίκτες. Πρέπει να ταιριάζουν!`
      );
      return;
    }

    assignCharactersRandomly();
    router.push('/reveal');
  };

  const totalSelected = Object.values(selectedCharacters).reduce((a: number, b: any) => a + (b as number), 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Επιλέξτε Χαρακτήρες Παιχνιδιού</Text>
      
      <Text style={styles.subtitle}>
        Επιλέξτε ποιοι χαρακτήρες θα είναι σε αυτό το παιχνίδι.
        Έχετε {players.length} παίκτ{players.length !== 1 ? 'ες' : 'η'}.
      </Text>

      <View style={styles.selectorsContainer}>
        <CharacterSelector
          character={CHARACTERS.CIVILIAN}
          count={selectedCharacters[CHARACTERS.CIVILIAN]}
          onChange={(count: number) => updateCharacterSelection(CHARACTERS.CIVILIAN, count)}
          description="👥 Αθώοι πολίτες"
        />
        <CharacterSelector
          character={CHARACTERS.KILLER1}
          count={selectedCharacters[CHARACTERS.KILLER1]}
          onChange={(count: number) => updateCharacterSelection(CHARACTERS.KILLER1, count)}
          description="🔪 Secret murderer"
        />
        <CharacterSelector
          character={CHARACTERS.KILLER2}
          count={selectedCharacters[CHARACTERS.KILLER2]}
          onChange={(count: number) => updateCharacterSelection(CHARACTERS.KILLER2, count)}
          description="🔪 Secret murderer"
        />
        <CharacterSelector
          character={CHARACTERS.COP}
          count={selectedCharacters[CHARACTERS.COP]}
          onChange={(count: number) => updateCharacterSelection(CHARACTERS.COP, count)}
          description="🛡️ Προστατεύει έναν παίκτη κάθε νύχτα"
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Σύνολο Επιλεγμένων: {totalSelected} / {players.length}
        </Text>
        {totalSelected === players.length && (
          <Text style={styles.successText}>✓ Τέλειο!</Text>
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
          onPress={handleAssignCharacters}
          style={styles.button}
          disabled={totalSelected !== players.length}
        >
          Ανάθεση Ρόλων
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NOIR_COLORS.darkBg,
  },
  scrollContent: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: NOIR_COLORS.neonRed,
  },
  subtitle: {
    marginBottom: 20,
    color: NOIR_COLORS.lightText,
    fontSize: 14,
    lineHeight: 20,
  },
  selectorsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  summary: {
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftColor: NOIR_COLORS.neonGreen,
    borderLeftWidth: 3,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: NOIR_COLORS.lightText,
  },
  successText: {
    fontSize: 14,
    color: NOIR_COLORS.neonGreen,
    marginTop: 8,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
});
