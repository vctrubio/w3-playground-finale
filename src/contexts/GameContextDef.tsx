import { createContext } from 'react';
import { GameEvent, GameTheory } from '../lib/game';
interface GameContextType {
    game: GameTheory | null;
    events: GameEvent[];
    pushEvent: (event: GameEvent) => void;
    initGameTheory: () => Promise<GameTheory | null>;
    networkId: string | undefined;
    // Add mapping functions to the context type
    mapAddressToTokens: () => Record<string, Record<number, number>>;
    mapTokenToAddresses: () => Record<number, Record<string, number>>;
    mapBalanceOfToken: (address: string, tokenId: number) => number;
}

export const GameContext = createContext<GameContextType | null>(null);
