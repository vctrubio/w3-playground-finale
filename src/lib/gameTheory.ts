import { ethers } from "ethers";
import { hasMetamask, getContract, getUserByProvider } from "./ethers";
import ErikContract from "../../contracts/Erik.json";
import ErikForge from "../../contracts/ErikForge.json";
import { GameTheory } from "./game";

async function getContractParent(user: User): Promise<Contract> {
  const contract = await getContract(
    user,
    ErikContract.address,
    ErikContract.abi
  );
  return {
    ...contract,
    chainId: ErikContract.chainId,
    name: ErikContract.name,
  };
}

async function getContractForge(user: User): Promise<Contract> {
  const contract = await getContract(user, ErikForge.address, ErikForge.abi);
  return {
    ...contract,
    chainId: ErikForge.chainId,
    name: ErikForge.name,
  };
}

async function getContractSocket(contract: Contract): Promise<Contract> {
  const wsProvider = new ethers.WebSocketProvider(
    `wss://mainnet.infura.io/ws/v3/${import.meta.env.VITE_INFURA_PROJECT_ID}`
  );
  const contractSocket = new ethers.Contract(
    contract.address,
    contract.abi,
    wsProvider
  );
  return {
    ...contract,
    instance: contractSocket,
    chainId: contract?.chainId,
    name: "Contract Listener",
  };
}

export async function initGameTheory(): Promise<GameTheory | null> {
  try {
    if (!hasMetamask()) throw new Error("MetaMask is not installed");

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const user = await getUserByProvider(provider);
    const getParentContract = await getContractParent(user);
    const getForgeContract = await getContractForge(user);
    const getSocket = await getContractSocket(getParentContract);

    return {
      User: user,
      ContractParent: getParentContract,
      ContractForge: getForgeContract,
      ContractSocket: getSocket,
    } as GameTheory;
  } catch (error) {
    console.error("Error initializing game theory:", error);
  }

  return null;
}
