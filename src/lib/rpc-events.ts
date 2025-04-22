import { ethers } from "ethers";
import { GameEvent } from "./game";

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
