import React, { createContext, ReactNode, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const CHARACTER_ROLES = {
  CIVILIAN: 'civilian',
  KILLER: 'killer',
  COP: 'cop',
};

export const CHARACTERS = {
  CIVILIAN: 'Πολίτης',
  KILLER1: 'Φανερός Δολοφόνος',
  KILLER2: 'Κρυφός Δολοφόνος',
  COP: 'Αστυνομικός',
};

export interface Player {
  id: string;
  name: string;
  character: string | null;
  hasRevealed: boolean;
  isAlive: boolean;
  role: string | null;
}

export interface GameContextType {
  // State
  players: Player[];
  selectedCharacters: Record<string, number>;
  gameState: 'setup' | 'character-reveal' | 'day' | 'night' | 'game-over';
  currentPhase: number;
  isDay: boolean;
  eliminatedPlayers: Player[];
  gameHistory: { phase: number; winner: string }[];
  CHARACTERS: typeof CHARACTERS;
  CHARACTER_ROLES: typeof CHARACTER_ROLES;

  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updateCharacterSelection: (character: string, count: number) => void;
  assignCharactersRandomly: () => void;
  revealPlayerCharacter: (playerId: string) => void;
  allPlayersRevealed: () => boolean;
  startGame: () => void;
  eliminatePlayer: (playerId: string) => void;
  checkGameOver: () => void;
  nextPhase: () => void;
  resetGame: () => void;
  resetGameKeepPlayers: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Record<string, number>>({
    [CHARACTERS.CIVILIAN]: 0,
    [CHARACTERS.KILLER1]: 0,
    [CHARACTERS.KILLER2]: 0,
    [CHARACTERS.COP]: 0,
  });
  const [gameState, setGameState] = useState<'setup' | 'character-reveal' | 'day' | 'night' | 'game-over'>('setup');
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isDay, setIsDay] = useState(true);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<Player[]>([]);
  const [gameHistory, setGameHistory] = useState<{ phase: number; winner: string }[]>([]);

  // Add a player to the game
  const addPlayer = useCallback((name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      character: null,
      hasRevealed: false,
      isAlive: true,
      role: null,
    };
    setPlayers((prev) => [...prev, newPlayer]);
  }, []);

  // Remove a player
  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }, []);

  // Update selected characters
  const updateCharacterSelection = useCallback((character: string, count: number) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [character]: Math.max(0, count),
    }));
  }, []);

  // Get role type from character
  const getRole = (character: string): string => {
    switch (character) {
      case CHARACTERS.KILLER1:
      case CHARACTERS.KILLER2:
        return CHARACTER_ROLES.KILLER;
      case CHARACTERS.COP:
        return CHARACTER_ROLES.COP;
      default:
        return CHARACTER_ROLES.CIVILIAN;
    }
  };

  // Assign characters randomly to players
  const assignCharactersRandomly = useCallback(() => {
    const characterPool: string[] = [];

    // Build character pool based on selection
    Object.entries(selectedCharacters).forEach(([character, count]) => {
      for (let i = 0; i < count; i++) {
        characterPool.push(character);
      }
    });

    // Shuffle character pool
    const shuffled = [...characterPool].sort(() => Math.random() - 0.5);

    // Assign to players
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      character: shuffled[index] || CHARACTERS.CIVILIAN,
      role: getRole(shuffled[index] || CHARACTERS.CIVILIAN),
    }));

    setPlayers(updatedPlayers);
    setGameState('character-reveal');
  }, [players, selectedCharacters]);

  // Mark player as revealed
  const revealPlayerCharacter = useCallback((playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, hasRevealed: true } : p))
    );
  }, []);

  // Check if all players revealed
  const allPlayersRevealed = useCallback(() => {
    return players.every((p) => p.hasRevealed);
  }, [players]);

  // Start the game (after all reveal)
  const startGame = useCallback(() => {
    setGameState('day');
    setCurrentPhase(1);
    setIsDay(true);
  }, []);

  // Eliminate a player (during day/night)
  const eliminatePlayer = useCallback((playerId: string) => {
    console.log('eliminatePlayer called with:', playerId);
    const player = players.find((p) => p.id === playerId);
    console.log('Found player:', player);
    if (!player) {
      console.log('Player not found');
      return;
    }

    const updated = players.map((p) => (p.id === playerId ? { ...p, isAlive: false } : p));
    console.log('Updated players:', updated);
    setPlayers(updated);
    setEliminatedPlayers((prevElim) => [...prevElim, player]);
    
    // Check win conditions immediately with updated players
    const aliveKillers = updated.filter((p) => p.role === CHARACTER_ROLES.KILLER && p.isAlive).length;
    const aliveCivilians = updated.filter(
      (p) => (p.role === CHARACTER_ROLES.CIVILIAN || p.role === CHARACTER_ROLES.COP) && p.isAlive
    ).length;

    console.log('Alive killers:', aliveKillers, 'Alive civilians:', aliveCivilians);

    if (aliveKillers === 0) {
      console.log('Town wins!');
      setGameState('game-over');
      setGameHistory((prev) => [...prev, { phase: currentPhase, winner: 'Town' }]);
    } else if (aliveKillers >= aliveCivilians) {
      console.log('Killers win!');
      setGameState('game-over');
      setGameHistory((prev) => [...prev, { phase: currentPhase, winner: 'Killers' }]);
    }
  }, [players, currentPhase]);

  // Check win conditions
  const checkGameOver = useCallback(() => {
    const alivePlayers = players.filter((p) => p.isAlive);
    const aliveKillers = alivePlayers.filter((p) => p.role === CHARACTER_ROLES.KILLER);
    const aliveCivilians = alivePlayers.filter(
      (p) => p.role === CHARACTER_ROLES.CIVILIAN || p.role === CHARACTER_ROLES.COP
    );

    if (aliveKillers.length === 0) {
      setGameState('game-over');
      setGameHistory((prev) => [...prev, { phase: currentPhase, winner: 'Town' }]);
    } else if (aliveKillers.length >= aliveCivilians.length) {
      setGameState('game-over');
      setGameHistory((prev) => [...prev, { phase: currentPhase, winner: 'Killers' }]);
    }
  }, [players, currentPhase]);

  // Transition to next phase
  const nextPhase = useCallback(() => {
    console.log('nextPhase called, current: isDay=', isDay, 'phase=', currentPhase);
    if (isDay) {
      console.log('Transitioning Day', currentPhase, '-> Night', currentPhase);
      setIsDay(false); // Night
    } else {
      console.log('Transitioning Night', currentPhase, '-> Day', currentPhase + 1);
      setIsDay(true);
      setCurrentPhase((prev) => prev + 1); // Next day
    }
    checkGameOver();
  }, [isDay, checkGameOver, currentPhase]);

  // Reset game
  const resetGame = useCallback(() => {
    setPlayers([]);
    setSelectedCharacters({
      [CHARACTERS.CIVILIAN]: 0,
      [CHARACTERS.KILLER1]: 0,
      [CHARACTERS.KILLER2]: 0,
      [CHARACTERS.COP]: 0,
    });
    setGameState('setup');
    setCurrentPhase(1);
    setIsDay(true);
    setEliminatedPlayers([]);
    setGameHistory([]);
  }, []);

  // Reset game but keep players
  const resetGameKeepPlayers = useCallback(() => {
    // Reset all players to alive and not revealed
    const resetPlayers = players.map((p) => ({
      ...p,
      character: null,
      hasRevealed: false,
      isAlive: true,
      role: null,
    }));
    setPlayers(resetPlayers);
    
    // Reset game state but keep player count
    setSelectedCharacters({
      [CHARACTERS.CIVILIAN]: 0,
      [CHARACTERS.KILLER1]: 0,
      [CHARACTERS.KILLER2]: 0,
      [CHARACTERS.COP]: 0,
    });
    setGameState('setup'); // Go back to character selection
    setCurrentPhase(1);
    setIsDay(true);
    setEliminatedPlayers([]);
    setGameHistory([]);
  }, [players]);

  const value: GameContextType = {
    // State
    players,
    selectedCharacters,
    gameState,
    currentPhase,
    isDay,
    eliminatedPlayers,
    gameHistory,
    CHARACTERS,
    CHARACTER_ROLES,

    // Actions
    addPlayer,
    removePlayer,
    updateCharacterSelection,
    assignCharactersRandomly,
    revealPlayerCharacter,
    allPlayersRevealed,
    startGame,
    eliminatePlayer,
    checkGameOver,
    nextPhase,
    resetGame,
    resetGameKeepPlayers,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
