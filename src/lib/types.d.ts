type Network = {
  name: string;
  id: string;
  balance: string;
  currency: string;
};

type User = {
  address: string;
  network: Network;
  signer: ethers.JsonRpcSigner;
  provider: ethers.BrowserProvider;
};

type Contract = {
  address: string;
  abi: ethers.InterfaceAbi;
  instance: ethers.Contract;
  chainId?: string;
  name?: string;
};

type NotificationType = "success" | "error" | "warning" | "info";
