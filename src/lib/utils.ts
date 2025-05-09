import { GameEvent, GameToken, TOKENS } from "./game.d";

export function getTokenById(id: number): GameToken | null {
  const token = TOKENS.find((t) => t.id === id);

  return token ? token : null;
}

/**
 * Calculate token balances from raw events for a specific address or all addresses
 */
export function calculateTokenBalances(
  events: GameEvent[],
  address?: string
): Record<number, number> {
  const balanceMap: Record<number, number> = {};

  events.forEach((event) => {
    // Skip if we're filtering by address and this event is for a different address
    if (address && event.address.toLowerCase() !== address.toLowerCase()) {
      return;
    }

    const { tokenId, amount, type } = event;

    if (!balanceMap[tokenId]) {
      balanceMap[tokenId] = 0;
    }

    if (type === "mint") {
      balanceMap[tokenId] += amount;
    } else if (type === "burn") {
      balanceMap[tokenId] -= amount;
    }
  });

  return balanceMap;
}

/**
 * Get balance for a specific token and address
 */
export function getTokenBalance(
  events: GameEvent[],
  tokenId: number,
  address: string
): number {
  let balance = 0;

  events.forEach((event) => {
    if (
      event.address.toLowerCase() !== address.toLowerCase() ||
      event.tokenId !== tokenId
    ) {
      return;
    }

    if (event.type === "mint") {
      balance += event.amount;
    } else if (event.type === "burn") {
      balance -= event.amount;
    }
  });

  return balance;
}

// Utility function to calculate mint and burn amounts for each address and token
export const calculateMintBurn = (
  rawEvents: GameEvent[],
  tokenId: number,
  address: string
) => {
  let minted = 0;
  let burned = 0;

  rawEvents?.forEach((event) => {
    if (event.tokenId === tokenId && event.address === address) {
      if (event.type === "mint") {
        minted += event.amount;
      } else if (event.type === "burn") {
        burned += event.amount;
      }
    }
  });

  return { minted, burned };
};

/**
 * Format token balance for display
 */
export function formatTokenBalance(balance: number): string {
  if (balance <= 0) return "";
  return balance === 1 ? "1 token" : `${balance} tokens`;
}

/**
 * Calculate total tokens by address from raw events
 */
export function getEventResult(
  events: GameEvent[]
): { address: string; tokenId: number; total: number }[] {
  const balanceMap: Record<string, Record<number, number>> = {};

  events.forEach((event) => {
    const { address, tokenId, amount, type } = event;

    if (!balanceMap[address]) {
      balanceMap[address] = {};
    }

    if (!balanceMap[address][tokenId]) {
      balanceMap[address][tokenId] = 0;
    }

    if (type === "mint") {
      balanceMap[address][tokenId] += amount;
    } else if (type === "burn") {
      balanceMap[address][tokenId] -= amount;
    }
  });

  const result: { address: string; tokenId: number; total: number }[] = [];

  Object.entries(balanceMap).forEach(([address, tokens]) => {
    Object.entries(tokens).forEach(([tokenId, total]) => {
      result.push({
        address,
        tokenId: Number(tokenId),
        total,
      });
    });
  });

  return result;
}

/**
 * Group events by token ID
 */
export function getEventsByTokenId(
  events: { address: string; tokenId: number; total: number }[]
): Record<number, { address: string; total: number }[]> {
  const tokenMap: Record<number, { address: string; total: number }[]> = {};

  events.forEach((event) => {
    const { tokenId, address, total } = event;

    if (!tokenMap[tokenId]) {
      tokenMap[tokenId] = [];
    }

    // should always be > 0, but just checking
    if (total > 0) {
      tokenMap[tokenId].push({
        address,
        total,
      });
    }
  });

  return tokenMap;
}
