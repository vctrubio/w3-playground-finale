import { createContext } from 'react';
import { GameEvent, GameTheory } from '../lib/game';
interface GameContextType {
    game: GameTheory | null;
    events: GameEvent[];
    pushEvent: (event: GameEvent) => void;
    initGameTheory: () => Promise<GameTheory | null>;
    networkId: string | undefined;
}

export const GameContext = createContext<GameContextType | null>(null);
