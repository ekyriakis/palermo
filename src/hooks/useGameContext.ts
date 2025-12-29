import { GameContext, GameContextType } from '@/src/context/GameContext';
import { useContext } from 'react';

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
