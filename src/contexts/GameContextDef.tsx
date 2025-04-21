import { createContext } from 'react';

interface GameContextType {
    game: GameTheory | null;
    initGameTheory: () => Promise<GameTheory | null>;
}

export const GameContext = createContext<GameContextType | null>(null);
