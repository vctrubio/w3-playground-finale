import { useState, ReactNode, useEffect } from 'react';
import { GameTheory } from '../lib/types';
import { GameContext } from './GameContextDef';
import { initGameTheory } from '../lib/gameTheory';

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<GameTheory | null>(null);

    useEffect(() => {
        console.log("GameProvider mounted");
    }, []);


    const handleInitGameTheory = async (): Promise<GameTheory | null> => {
        try {
            const gameTheory = await initGameTheory();
            if (gameTheory) {
                setGame(gameTheory);
            }
            console.log("Game Theory initialized:", gameTheory);
            return gameTheory;
        } catch (error) {
            console.error('Error initializing game theory:', error);
            return null;
        }
    };

    // if (window)
    //     window.gg = game;

    return (
        <GameContext.Provider value={{
            game,
            initGameTheory: handleInitGameTheory
        }}>
            {children}
        </GameContext.Provider>
    );
}
