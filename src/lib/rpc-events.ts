import { ethers } from "ethers";


export async function getLogs(
  filter: ethers.Filter,
  provider: ethers.Provider
): Promise<ethers.Log[]> {
  const raw = await provider.getLogs(filter);
  return raw;
}