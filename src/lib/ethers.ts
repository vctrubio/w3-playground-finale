import { ethers } from "ethers";

export function hasMetamask() {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
}

export async function getUserByProvider(
  provider: ethers.BrowserProvider,
): Promise<User> {
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(address);
  const currency = "ETH"; // default to ETH, you can modify this based on the network

  return {
    address,
    signer,
    provider,
    network: {
      id: network.chainId.toString(),
      name: network.name,
      balance: ethers.formatEther(balance),
      currency: currency,
    },
  };
}

export async function getWallet(): Promise<User | null> {
  if (!hasMetamask()) return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum!);
    await provider.send("eth_requestAccounts", []);

    return await getUserByProvider(provider);
  } catch (error) {
    console.error("Error creating provider:", error);
    return null;
  }
}

export async function getContract(
  user: User,
  address: string,
  abi: ethers.InterfaceAbi,
): Promise<Contract> {
  const contract = new ethers.Contract(address, abi, user.signer);
  return {
    address,
    abi,
    instance: contract,
  };
}
