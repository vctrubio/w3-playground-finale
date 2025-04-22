import { createContext } from 'react';
import { GameEvent } from '../lib/game';
interface GameContextType {
    game: GameTheory | null;
    events: GameEvent[];
    initGameTheory: () => Promise<GameTheory | null>;
    networkId: string | undefined;
}

export const GameContext = createContext<GameContextType | null>(null);
