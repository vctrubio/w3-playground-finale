import { createContext } from 'react';
import { GameTheory } from '../lib/types';

interface GameContextType {
    game: GameTheory | null;
    initGameTheory: () => Promise<GameTheory | null>;
}

export const GameContext = createContext<GameContextType | null>(null);
