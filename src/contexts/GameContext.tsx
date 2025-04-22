import { useState, ReactNode, useEffect } from "react";
import { ethers } from "ethers";
import { GameContext } from "./GameContextDef";
import { initGameTheory } from "../lib/gameTheory";
import { hasMetamask, getUserByProvider } from "../lib/ethers";
import { useNotifications } from "../hooks/useNotifications";
import { GameEvent } from "../lib/game";
import { getTokenById } from "../lib/utils";
import { getLogs } from "../lib/rpc-events";

function initListener(
    contract: ethers.Contract,
    addEventCallback: (newEvent: GameEvent) => void,
    showNotification: any
) {
    contract.on(
        "Mint",
        (to: string, tokenId: number, amount: number, event: any) => {
            const token = getTokenById(Number(tokenId));
            if (!token) return;
            const msg = `${to.substring(0, 2)}...${to.substring(
                to.length - 3
            )} minted ${token.name}`;
            console.log(msg);
            showNotification(msg, "success", 5000);

            const newEvent: GameEvent = {
                address: to,
                tokenId: Number(tokenId),
                amount: Number(amount),
                type: "mint",
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
            };

            addEventCallback(newEvent);

            // Dispatch a custom event that Game.tsx can listen to
            const tokenUpdateEvent = new CustomEvent("tokenUpdate", {
                detail: {
                    type: "mint",
                    address: to,
                    tokenId: Number(tokenId),
                    amount: Number(amount),
                },
            });
            window.dispatchEvent(tokenUpdateEvent);
        }
    );

    contract.on(
        "Burn",
        (from: string, tokenId: number, amount: number, event: any) => {
            const token = getTokenById(Number(tokenId));
            if (!token) return;
            const msg = `${from.substring(0, 2)}...${from.substring(
                from.length - 3
            )} burned ${token.name}`;
            console.log(msg);
            showNotification(msg, "warning", 5000);

            const newEvent: GameEvent = {
                address: from,
                tokenId: Number(tokenId),
                amount: Number(amount),
                type: "burn",
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
            };

            addEventCallback(newEvent);

            // Dispatch a custom event that Game.tsx can listen to // to be decided
            // this can be done through window.EventListener ... 
            const tokenUpdateEvent = new CustomEvent("tokenUpdate", {
                detail: {
                    type: "burn",
                    address: from,
                    tokenId: Number(tokenId),
                    amount: Number(amount),
                },
            });
            window.dispatchEvent(tokenUpdateEvent);
        }
    );

    // Return a cleanup function to remove listeners
    return () => {
        contract.removeAllListeners("Mint");
        contract.removeAllListeners("Burn");
    };
}

//get Mint and Burn logs from the contract
async function getFilterLogs(contract: Contract, user: User): Promise<GameEvent[]> {
    const filterMint: ethers.Filter = {
        address: contract.address,
        fromBlock: 0,
        toBlock: 'latest',
        topics: [
            ethers.id('Mint(address,uint256,uint256)'),
        ],
    };

    const filterBurn: ethers.Filter = {
        address: contract.address,
        fromBlock: 0,
        toBlock: 'latest',
        topics: [
            ethers.id('Burn(address,uint256,uint256)'),
        ],
    };

    const [mintLogs, burnLogs] = await Promise.all([
        getLogs(filterMint, user.provider),
        getLogs(filterBurn, user.provider)
    ]);

    const parsedMintLogs = mintLogs.map((log) => {
        const parsedLog = contract.instance?.interface.parseLog(log);
        return {
            address: parsedLog?.args[0],
            tokenId: Number(parsedLog?.args[1]),
            amount: Number(parsedLog?.args[2]),
            type: 'mint',
        } as GameEvent;
    });

    const parsedBurnLogs = burnLogs.map((log) => {
        const parsedLog = contract.instance?.interface.parseLog(log);
        return {
            address: parsedLog?.args[0],
            tokenId: Number(parsedLog?.args[1]),
            amount: Number(parsedLog?.args[2]),
            type: 'burn',
        } as GameEvent;
    });

    const allEvents = [...parsedMintLogs, ...parsedBurnLogs];
    return allEvents;
}

//we have the events, but now we ned to sort them by token id, and by user address
//todo and to think


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
            if (gameTheory) {
                setGame(gameTheory);
            }
            showNotification(
                `Welcome ${gameTheory?.User?.address.substring(0, 3)}...${gameTheory?.User?.address.substring(gameTheory?.User?.address.length - 2)}`,
                "success",
            );
            return gameTheory;
        } catch (error) {
            console.error("Error initializing game theory:", error);
            return null;
        }
    };

    window.ge = events;

    return (
        <GameContext.Provider
            value={{
                game,
                events,
                initGameTheory: handleInitGameTheory,
                networkId: game?.User?.network.id,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
