import { NOIR_COLORS } from '@/src/constants/noirTheme';
import { useGameContext } from '@/src/hooks/useGameContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  const router = useRouter();
  const { resetGame } = useGameContext();

  const handleNewGame = () => {
    resetGame();
    router.push('/players');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🌙 Night In Palermo</Text>
        <Text style={styles.subtitle}>A Game of Deception</Text>
        
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Ένα συναρπαστικό παιχνίδι όπου οι πολίτες πρέπει να εξαλείψουν τους κρυμμένους δολοφόνους, ή θα αντιμετωπίσουν τη δική τους εξάλειψη!
          </Text>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>Πώς να Παίξετε</Text>
          <Text style={styles.rulesText}>
            • Προσθέστε παίκτες και επιλέξτε χαρακτήρες{'\n'}
            • Κάθε παίκτης βλέπει μόνο το δικό του μυστικό ρόλο{'\n'}
            • Κατά τη διάρκεια της μέρας, ψηφίστε για εξάλειψη{'\n'}
            • Μετά την εξάλειψη, ο ρόλος του αποκαλύπτεται{'\n'}
            • Τη νύχτα, οι δολοφόνοι επιλέγουν κρυφά{'.\n'}
            • Οι δολοφόνοι κερδίζουν αν ισούνται με τους πολίτες{'.\n'}
            • Η πόλη κερδίζει αν όλοι οι δολοφόνοι εξαλειφθούν
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleNewGame}
            style={styles.button}
          >
            Νέο Παιχνίδι
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: NOIR_COLORS.darkBg,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: NOIR_COLORS.neonRed,
    textShadowColor: NOIR_COLORS.shadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: NOIR_COLORS.mutedText,
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 30,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: NOIR_COLORS.darkCard,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: NOIR_COLORS.neonRed,
  },
  descriptionText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    color: NOIR_COLORS.lightText,
  },
  rulesContainer: {
    backgroundColor: NOIR_COLORS.darkCard,
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    borderTopWidth: 2,
    borderTopColor: NOIR_COLORS.neonBlue,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: NOIR_COLORS.neonBlue,
  },
  rulesText: {
    fontSize: 14,
    lineHeight: 22,
    color: NOIR_COLORS.lightText,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    backgroundColor: NOIR_COLORS.neonRed,
  },
});
