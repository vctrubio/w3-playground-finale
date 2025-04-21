import { ethers } from "ethers";
import { User } from "./types";

export function hasMetamask() {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
}

async function getWalletByProvider(provider: ethers.BrowserProvider) {
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(address);
  const currency = "ETH"; // default to ETH, you can modify this based on the network

  return {
    address,
    signer,
    network: {
      id: network.chainId.toString(),
      name: network.name,
      balance: ethers.formatEther(balance),
      currency: currency,
    },
  };
}

export async function getUserWallet(): Promise<User | null> {
  if (!hasMetamask()) {
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const userWallet = await getWalletByProvider(provider);
    return {
      ...userWallet,
      provider,
      socket: undefined,
    };
  } catch (error) {
    console.error("Error getting user wallet:", error);
    return null;
  }
}
