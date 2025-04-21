import { useState, ReactNode, useEffect } from 'react';
import { GameContext } from './GameContextDef';
import { initGameTheory } from '../lib/gameTheory';
import { getWallet, hasMetamask } from '../lib/ethers';

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<GameTheory | null>(null);

    useEffect(() => {
        console.log("GameProvider mounted");
    }, []);


    useEffect(() => {
        //we need to mgirate game.User to only update...
        if (hasMetamask()) {
            const handleChainChanged = async () => {
                console.log("Network changed, refreshing data...");
                // const newUser = await getWallet();
                // only change the game.user.network
            };

            const handleAccountsChanged = async (accounts: string[]) => {
                console.log("Accounts changed:", accounts);
                if (accounts.length === 0) {
                    console.log("User disconnected wallet");
                    setGame(null);
                }
                else if (accounts[0] !== game?.User.address) {
                    console.log("User changed account");
                    const user = await getWallet();
                    if (user) {
                        console.log("User changed account:", user);
                    }
                }

            };

            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, [game?.User]);

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

    return (
        <GameContext.Provider value={{
            game,
            initGameTheory: handleInitGameTheory
        }}>
            {children}
        </GameContext.Provider>
    );
}
