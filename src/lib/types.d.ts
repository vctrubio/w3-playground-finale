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
  socket?: ethers.WebSocketProvider;
};

export type Contract = {
  address: string;
  abi: ethers.InterfaceAbi;
  instance: ethers.Contract;
  chainId?: number;
  name?: string;
};
