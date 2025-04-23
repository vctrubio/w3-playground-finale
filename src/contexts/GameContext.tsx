import { useState, ReactNode, useEffect } from "react";
import { ethers } from "ethers";
import { GameContext } from "./GameContextDef";
import { initGameTheory } from "../lib/gameTheory";
import { hasMetamask, getUserByProvider } from "../lib/ethers";
import { useNotifications } from "../hooks/useNotifications";
import { GameEvent, GameTheory } from "../lib/game";
import {
    getFilterLogs,
    initListener,
    mapAddressToTokens,
    mapTokenToAddresses,
    mapBalanceOfToken
} from "../lib/rpc-events";


//in initGameTheory or handle game theory we need to pass a param, that will be null if user doesnt ecxist. ie on the first mount,
// -- this, if user is changed. we dont need the socket to change, if the socket doesnt change, then we dont need to reint the listener or the filterlogs....
export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<GameTheory | null>(null);
    const [events, setEvents] = useState<GameEvent[]>([]);
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
                    showNotification(
                        `Failed to update network: ${(error as Error).message}`,
                        "error",
                    );
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
                    if (
                        game?.User?.address &&
                        accounts[0].toLowerCase() === game.User.address.toLowerCase()
                    ) {
                        console.log("Same account selected, no change needed");
                        return;
                    }

                    await handleInitGameTheory();
                } catch (error) {
                    console.error("Error handling account change:", error);
                    showNotification(
                        `Failed to switch account: ${(error as Error).message}`,
                        "error",
                    );
                }
            };

            window.ethereum.on("chainChanged", handleChainChanged);
            window.ethereum.on("accountsChanged", handleAccountsChanged);

            return () => {
                window.ethereum.removeListener("chainChanged", handleChainChanged);
                window.ethereum.removeListener(
                    "accountsChanged",
                    handleAccountsChanged,
                );
            };
        }
        //qs: should showNotification be here?
    }, [game?.User, showNotification]);

    //when there is a new contractsocket (which there should not be) -- initListener, to se events
    useEffect(() => {
        if (game?.ContractSocket?.instance) {
            const addNewEvent = (newEvent: GameEvent) => {
                setEvents(prevEvents => [...prevEvents, newEvent]);
            };

            const cleanup = initListener(game.ContractSocket.instance, addNewEvent, showNotification);

            return () => {
                if (cleanup) cleanup();
            };
        }
    }, [game?.ContractSocket?.instance, showNotification]);

    const handleInitGameTheory = async (): Promise<GameTheory | null> => {
        try {
            const gameTheory = await initGameTheory();
            if (!gameTheory) {
                showNotification("Failed to initialize game theory", "error");
                showNotification("Please contact vctrubio@gmail.com", "warning");
                return null;
            }
            showNotification(
                `Welcome ${gameTheory?.User?.address.substring(0, 3)}...${gameTheory?.User?.address.substring(gameTheory?.User?.address.length - 2)}`,
                "success",
            );

            setGame(gameTheory);

            const events = await getFilterLogs(gameTheory.ContractSocket, gameTheory.User);
            if (events.length > 0) {
                setEvents(events);
                showNotification(
                    `Fetched ${events.length} events from the blockchain`,
                    "success",
                )
            }
            return gameTheory;
        } catch (error) {
            console.error("Error initializing game theory:", error);
            return null;
        }
    };

    const pushEvent = (event: GameEvent) => {
        setEvents(prevEvents => [...prevEvents, event]);
    };

    return (
        <GameContext.Provider
            value={{
                game,
                events,
                pushEvent,
                initGameTheory: handleInitGameTheory,
                networkId: game?.User?.network.id,
                // Add the mapping functions from rpc-events
                mapAddressToTokens: () => mapAddressToTokens(events),
                mapTokenToAddresses: () => mapTokenToAddresses(events),
                mapBalanceOfToken: (address: string, tokenId: number) =>
                    mapBalanceOfToken(events, address, tokenId),
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
