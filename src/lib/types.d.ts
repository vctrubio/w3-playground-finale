export type Network = {
  name: string;
  id: string;
  balance: string;
  currency: string;
};

export type User = {
  address: string;
  network: Network;
  signer: ethers.JsonRpcSigner;
  provider: ethers.BrowserProvider;
};

export type Contract = {
  address: string;
  abi: ethers.InterfaceAbi;
  instance: ethers.Contract;
  chainId?: string;
  name?: string;
};

export type GameTheory = {
  User: User;
  ContractParent: Contract;
  ContractForge: Contract;
  ContractSocket: Contract;
};
