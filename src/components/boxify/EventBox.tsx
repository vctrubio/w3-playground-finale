import { useGame } from '../../hooks/useGame';
import { mapTokenToAddresses } from '../../lib/rpc-events';
import { getTokenById } from '../../lib/utils';
import { GameEvent } from '../../lib/game';
import { useState, useEffect } from 'react';

interface TokenOwnership {
    address: string;
    total: number;
}

interface TokenOwnerships {
    [tokenId: number]: TokenOwnership[];
}

function EventBox() {
    const { events, game } = useGame();
    const userAddress = game?.User.address;
    const [isLoading, setIsLoading] = useState(true);

    // Add effect to track when events are loaded
    useEffect(() => {
        if (events) {
            // Give network events a moment to load
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [events]);

    // Calculate token ownership
    const rawTokenEvents: Record<number, Record<string, number>> = events ? mapTokenToAddresses(events) : {};

    // Convert the rawTokenEvents (Record) to the desired TokenOwnerships format
    const tokenEvents: TokenOwnerships = {};
    for (const tokenIdStr in rawTokenEvents) {
        const tokenId = Number(tokenIdStr);
        const addressTotals = rawTokenEvents[tokenId];
        const ownershipArray: TokenOwnership[] = [];

        for (const address in addressTotals) {
            const total = addressTotals[address];
            // We already filter for > 0 in mapTokenToAddresses, but double-check doesn't hurt
            if (total > 0) {
                ownershipArray.push({ address, total });
            }
        }
        // Only add if there are owners
        if (ownershipArray.length > 0) {
            tokenEvents[tokenId] = ownershipArray;
        }
    }

    // Utility function to calculate mint and burn amounts for each address and token
    const calculateMintBurn = (rawEvents: GameEvent[], tokenId: number, address: string) => {
        let minted = 0;
        let burned = 0;

        rawEvents?.forEach(event => {
            if (event.tokenId === tokenId && event.address.toLowerCase() === address.toLowerCase()) {
                if (event.type === 'mint') {
                    minted += event.amount;
                } else if (event.type === 'burn') {
                    burned += event.amount;
                }
            }
        });

        return { minted, burned };
    };

    const isUserAddress = (address: string): boolean => {
        return userAddress ? address.toLowerCase() === userAddress.toLowerCase() : false;
    };

    return (
        <div className="mt-4">
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="ml-2">Loading events...</p>
                </div>
            ) : Object.keys(tokenEvents).length === 0 ? (
                <p>No token events found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">Token</th>
                                <th className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">Address</th>
                                <th className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">Minted</th>
                                <th className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">Burned</th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Use the converted tokenEvents */}
                            {Object.entries(tokenEvents).flatMap(([tokenId, ownerships]) => {
                                const token = getTokenById(Number(tokenId));
                                if (!token) return []; // Skip if token not found

                                // ownerships is now correctly TokenOwnership[]
                                return ownerships.map((ownership: TokenOwnership, index: number) => {
                                    const { minted, burned } = calculateMintBurn(events || [], Number(tokenId), ownership.address);
                                    const isUser = isUserAddress(ownership.address);

                                    // Apply special styling for the user's address
                                    const addressClass = isUser
                                        ? "py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 font-mono text-sm bg-yellow-100 dark:bg-orange-900 text-yellow-800 dark:text-orange-200"
                                        : "py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 font-mono text-sm text-gray-800 dark:text-gray-200";


                                    const tokenStyle = {
                                        backgroundColor: `${token.color}20`, // Use token color with transparency
                                        borderLeft: `3px solid ${token.color}`
                                    };

                                    return (
                                        <tr key={`${tokenId}-${ownership.address}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            {index === 0 ? (
                                                <td className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-200"
                                                    style={tokenStyle}
                                                    rowSpan={ownerships.length}>
                                                    {token.name}
                                                </td>
                                            ) : null}
                                            <td className={addressClass}>
                                                {ownership.address.substring(0, 6)}...{ownership.address.substring(ownership.address.length - 4)}
                                            </td>
                                            <td className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 text-center text-gray-800 dark:text-gray-200">{minted}</td>
                                            <td className="py-2 px-4 border-b border-r border-gray-200 dark:border-gray-600 text-center text-gray-800 dark:text-gray-200">{burned}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-center font-semibold text-gray-800 dark:text-gray-200">{ownership.total}</td>
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default EventBox;