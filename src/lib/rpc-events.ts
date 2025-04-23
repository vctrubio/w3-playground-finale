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

//get Mint and Burn logs from the contract -- for the initialization of the game
export async function getFilterLogs(
  contract: Contract,
  user: User
): Promise<GameEvent[]> {
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
  console.log("Initializing event listeners...");
  contract.on(
    "Mint",
    (to: string, tokenId: number, amount: number, event: any) => {
      const token = getTokenById(Number(tokenId));
      if (!token) return;
      const msg = `${to.substring(0, 2)}...${to.substring(
        to.length - 3
      )} minted ${token.name}`;
      showNotification(msg, "blue", 5000);

      const newEvent: GameEvent = {
        address: to,
        tokenId: Number(tokenId),
        amount: Number(amount),
        type: "mint",
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
      };

      addEventCallback(newEvent);
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
      showNotification(msg, "blue", 5000);

      const newEvent: GameEvent = {
        address: from,
        tokenId: Number(tokenId),
        amount: Number(amount),
        type: "burn",
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
      };

      addEventCallback(newEvent);
    }
  );

  // Return a cleanup function to remove listeners
  return () => {
    contract.removeAllListeners("Mint");
    contract.removeAllListeners("Burn");
  };
}

/**
 * Maps user addresses to their token IDs with quantities
 * @param events All game events
 * @returns A map of addresses to {tokenId: quantity} objects
 */
export function mapAddressToTokens(
  events: GameEvent[]
): Record<string, Record<number, number>> {
  const addressMap: Record<string, Record<number, number>> = {};

  for (const event of events) {
    const address = event.address.toLowerCase();
    const tokenId = event.tokenId;
    const quantity = event.amount || 1;
    const isAddition = event.type === "mint";

    // Initialize the address record if it doesn't exist
    if (!addressMap[address]) {
      addressMap[address] = {};
    }

    // Add or subtract the quantity based on event type
    addressMap[address][tokenId] =
      (addressMap[address][tokenId] || 0) + (isAddition ? quantity : -quantity);

    // Remove tokens with zero or negative balance
    if (addressMap[address][tokenId] <= 0) {
      delete addressMap[address][tokenId];
    }
  }

  return addressMap;
}

/**
 * Maps token IDs to the addresses that own them with quantities
 * @param events All game events
 * @returns A map of tokenIds to {address: quantity} objects
 */
export function mapTokenToAddresses(
  events: GameEvent[]
): Record<number, Record<string, number>> {
  // Revert to the simpler implementation returning the Record directly
  const tokenMap: Record<number, Record<string, number>> = {};

  for (const event of events) {
    const address = event.address.toLowerCase();
    const tokenId = event.tokenId;
    const quantity = event.amount || 1;
    const isAddition = event.type === "mint";

    if (!tokenMap[tokenId]) {
      tokenMap[tokenId] = {};
    }

    // Add or subtract the quantity based on event type
    tokenMap[tokenId][address] =
      (tokenMap[tokenId][address] || 0) + (isAddition ? quantity : -quantity);

    // Remove addresses with zero or negative balance
    if (tokenMap[tokenId][address] <= 0) {
      delete tokenMap[tokenId][address];
      // If a token has no owners left, remove the token entry itself
      if (Object.keys(tokenMap[tokenId]).length === 0) {
        delete tokenMap[tokenId];
      }
    }
  }

  return tokenMap;
}

/**
 * Get the balance of a specific token for an address
 * @param events All game events
 * @param address The user's address
 * @param tokenId The token ID to check balance for
 * @returns The token balance for the specified address
 */
export function mapBalanceOfToken(
  events: GameEvent[],
  address: string,
  tokenId: number
): number {
  let balance = 0;
  const lowerAddress = address.toLowerCase();

  for (const event of events) {
    if (
      event.address.toLowerCase() === lowerAddress &&
      event.tokenId === tokenId
    ) {
      if (event.type === "mint") {
        balance += event.amount;
      } else if (event.type === "burn") {
        balance -= event.amount;
      }
    }
  }

  return Math.max(0, balance); // Ensure we don't return negative balances
}
