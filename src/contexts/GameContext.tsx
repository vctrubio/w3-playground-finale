import { useState, ReactNode, useEffect, useCallback } from "react";
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

                    await handleInitGameTheory();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game?.User, showNotification]);

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

            const historicalEvents = await getFilterLogs(gameTheory.ContractSocket, gameTheory.User);
            if (historicalEvents.length > 0) {
                setEvents(historicalEvents);
                showNotification(
                    `Fetched ${historicalEvents.length} historical events`,
                    "info",
                )
            }
            setGame(gameTheory);

            return gameTheory;
        } catch (error) {
            console.error("Error initializing game theory:", error);
            setGame(null);
            setEvents([]);
            showNotification(
                `Initialization failed: ${(error as Error).message}`,
                "error",
            );
            return null;
        }
    };

    // Wrap pushEvent in useCallback to stabilize its reference for useEffect dependencies
    const pushEvent = useCallback((event: GameEvent) => {
        console.log("Pushing event:", event);
        setEvents(prevEvents => {
            return [...prevEvents, event];
        });
    }, []); // setEvents is stable

    useEffect(() => {
        if (game?.ContractSocket?.instance) {

            const cleanupListener = initListener(
                game.ContractSocket.instance,
                pushEvent,
                showNotification
            );

            // Return cleanup function on unmount
            return () => {
                console.log("Cleaning up event listener...");
                cleanupListener();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game?.ContractSocket?.instance]);

    return (
        <GameContext.Provider
            value={{
                game,
                events,
                pushEvent,
                initGameTheory: handleInitGameTheory,
                networkId: game?.User?.network.id,
                // mapping functions from rpc-eventse
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
