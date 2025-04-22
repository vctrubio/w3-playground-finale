import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { getTokenById, calculateMintBurn } from "../../lib/utils";
import { getLogs } from '../../lib/rpc-events';
import { useNotifications } from '../../hooks/useNotifications';
import { GameEvent, TokenOwnerships } from '../../lib/game';
import { useGame } from '../../hooks/useGame';

function initListener(contract: ethers.Contract, addEventCallback: (newEvent: GameEvent) => void, showNotification: any) {
    contract.on("Mint", (to: string, tokenId: number, amount: number, event: any) => {
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
    contract.on("Burn", (from: string, tokenId: number, amount: number, event: any) => {
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

        // Dispatch a custom event that Game.tsx can listen to
        // via   window.addEventListener("tokenUpdate", handler);
        // and   return () => window.removeEventListener("tokenUpdate", handler);
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

    // Return a cleanup function to remove listeners -- aka callback function
    return () => {
        contract.removeAllListeners("Mint");
        contract.removeAllListeners("Burn");
    };
}

function EventTable() {

}

function EventBox() {

    const { game } = useGame();
    const { showNotification } = useNotifications();
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [events, setEvents] = useState<GameEvent[]>([]);

    /*
    todos: change the events inside the GameProvider. 
    init the listener inside then. , 
    have eventbox pass events to teh event table... 
    also have Gamebox update teh tokens for each user

    */

    return (<>
        hi lover
    </>)
}

export default EventBox;