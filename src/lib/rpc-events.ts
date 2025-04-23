import { ethers } from "ethers";
import { GameEvent } from "./game";
import { getTokenById } from "./utils";

export async function getLogs(
  filter: ethers.Filter,
  provider: ethers.Provider
): Promise<ethers.Log[]> {
  const raw = await provider.getLogs(filter);
  return raw;
}

//get Mint and Burn logs from the contract
export async function getFilterLogs(
  contract: Contract,
  user: User
): Promise<GameEvent[]> {
  console.log('can u heear meee...:?')
  const filterMint: ethers.Filter = {
    address: contract.address,
    fromBlock: 0,
    toBlock: "latest",
    topics: [ethers.id("Mint(address,uint256,uint256)")],
  };

  const filterBurn: ethers.Filter = {
    address: contract.address,
    fromBlock: 0,
    toBlock: "latest",
    topics: [ethers.id("Burn(address,uint256,uint256)")],
  };

  const [mintLogs, burnLogs] = await Promise.all([
    getLogs(filterMint, user.provider),
    getLogs(filterBurn, user.provider),
  ]);

  const parsedMintLogs = mintLogs.map((log) => {
    const parsedLog = contract.instance?.interface.parseLog(log);
    return {
      address: parsedLog?.args[0],
      tokenId: Number(parsedLog?.args[1]),
      amount: Number(parsedLog?.args[2]),
      type: "mint",
    } as GameEvent;
  });

  const parsedBurnLogs = burnLogs.map((log) => {
    const parsedLog = contract.instance?.interface.parseLog(log);
    return {
      address: parsedLog?.args[0],
      tokenId: Number(parsedLog?.args[1]),
      amount: Number(parsedLog?.args[2]),
      type: "burn",
    } as GameEvent;
  });

  const allEvents = [...parsedMintLogs, ...parsedBurnLogs];
  return allEvents;
}

export function initListener(
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

      console.log("----------newEvent-----------", newEvent);
      addEventCallback(newEvent);

      //-- try without
      // Dispatch a custom event that Game.tsx can listen to
      // const tokenUpdateEvent = new CustomEvent("tokenUpdate", {
      //   detail: {
      //     type: "mint",
      //     address: to,
      //     tokenId: Number(tokenId),
      //     amount: Number(amount),
      //   },
      // });
      // window.dispatchEvent(tokenUpdateEvent);
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

      console.log("----------newEvent-----------", newEvent);
      addEventCallback(newEvent);

      // Dispatch a custom event that Game.tsx can listen to // to be decided
      // this can be done through window.EventListener ...
      // const tokenUpdateEvent = new CustomEvent("tokenUpdate", {
      //   detail: {
      //     type: "burn",
      //     address: from,
      //     tokenId: Number(tokenId),
      //     amount: Number(amount),
      //   },
      // });
      // window.dispatchEvent(tokenUpdateEvent);
    }
  );

  // Return a cleanup function to remove listeners
  return () => {
    contract.removeAllListeners("Mint");
    contract.removeAllListeners("Burn");
  };
}
