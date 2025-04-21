import { useState, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { GameContext } from './GameContextDef';
import { initGameTheory } from '../lib/gameTheory';
import { getWallet, hasMetamask, getUserByProvider } from '../lib/ethers';
import { useNotifications } from '../hooks/useNotifications';

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<GameTheory | null>(null);
    const { showNotification } = useNotifications();

    useEffect(() => {
        console.log("GameProvider mounted");
    }, []);

    useEffect(() => {
        if (hasMetamask()) {
            const handleChainChanged = async () => {
                console.log("Network changed, refreshing data...");
                try {
                    if (!game?.User?.provider) return;

                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const user = await getUserByProvider(provider);

                    setGame((prevGame) => {
                        if (!prevGame) return null;
                        return {
                            ...prevGame,
                            User: {
                                ...prevGame.User,
                                provider: provider, // Update with fresh provider
                                network: user.network,
                            },
                        };
                    });

                    showNotification(`Network changed to ${user.network.name}`, "info");
                } catch (error) {
                    console.error("Error handling chain change:", error);
                    showNotification(`Failed to update network: ${(error as Error).message}`, "error");
                }
            };

            const handleAccountsChanged = async (accounts: string[]) => {
                console.log("Accounts changed:", accounts);
                try {
                    if (accounts.length === 0) {
                        console.log("User disconnected wallet");
                        setGame(null);
                        showNotification("Wallet disconnected", "warning");
                        return;
                    }

                    // Only proceed if account actually changed
                    if (game?.User?.address && accounts[0].toLowerCase() === game.User.address.toLowerCase()) {
                        console.log("Same account selected, no change needed");
                        return;
                    }

                    console.log("User changed account");
                    const newUser = await getWallet();
                    // we only need to update the game.User | Contract Logic stays the same
                    if (newUser) {
                        setGame((prevGame) => {
                            if (!prevGame) return null;
                            return {
                                ...prevGame,
                                User: newUser,
                            };
                        });
                        showNotification(`Connected to account: ${accounts[0].substring(0, 6)}...`, "success");
                    }
                } catch (error) {
                    console.error("Error handling account change:", error);
                    showNotification(`Failed to switch account: ${(error as Error).message}`, "error");
                }
            };

            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
        //qs: should showNotification be here?
    }, [game?.User, showNotification]);

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
