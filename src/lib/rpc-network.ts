export const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;

export interface NetworkChain {
  id: string;
  name: string;
  rpcUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer?: string;
}

export const networkChains: NetworkChain[] = [
  {
    id: "1",
    name: "Ethereum Mainnet",
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    currency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://etherscan.io",
  },
  {
    id: "11155111",
    name: "Sepolia Testnet",
    rpcUrl: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
    currency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://sepolia.etherscan.io",
  },
  {
    id: "31337",
    name: "Localhost (Hardhat)",
    rpcUrl: "http://localhost:8545",
    currency: {
      name: "Hardhat Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: "137",
    name: "Polygon Mainnet",
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    currency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorer: "https://polygonscan.com",
  },
];

export function isLocalNetwork(chainId: string): boolean {
  return chainId === "31337" || chainId === "1337";
}

export async function addNetwork(chain: NetworkChain): Promise<ApiResponse> {
  if (typeof window?.ethereum === "undefined") {
    return {
      success: false,
      message: "MetaMask or compatible wallet not found",
      type: "error",
    };
  }

  try {
    const params = {
      chainId: `0x${parseInt(chain.id).toString(16)}`,
      chainName: chain.name,
      rpcUrls: [chain.rpcUrl],
      nativeCurrency: chain.currency || {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    };

    if (chain.blockExplorer) {
      Object.assign(params, { blockExplorerUrls: [chain.blockExplorer] });
    }

    await window.ethereum!.request({
      method: "wallet_addEthereumChain",
      params: [params],
    });

    return {
      success: true,
      message: `${chain.name} has been added to your wallet`,
      type: "success",
    };
  } catch (error: any) {
    console.error("Error adding network:", error);

    // Specific error handling for local networks
    if (isLocalNetwork(chain.id)) {
      if (error.message?.includes("resolve host")) {
        return {
          success: false,
          message: `Failed to connect to ${chain.name}. Make sure your local node is running.`,
          code: error.code,
          type: "error",
        };
      }
    }

    return {
      success: false,
      message: error.message || "Failed to add network",
      code: error.code,
      type: "error",
    };
  }
}

export async function switchNetwork(chainId: string): Promise<ApiResponse> {
  console.log("hex chainId:", `0x${parseInt(chainId).toString(16)}`);
  if (typeof window?.ethereum === "undefined") {
    return {
      success: false,
      message: "MetaMask or compatible wallet not found",
      type: "error",
    };
  }

  try {
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
    });

    return {
      success: true,
      message: "Network switched successfully",
      type: "success",
    };
  } catch (error: any) {
    // Handle the case where the chain hasn't been added to MetaMask
    if (
      error.code === 4902 ||
      (error.message && error.message.includes("Unrecognized chain ID"))
    ) {
      const chain = networkChains.find((c) => c.id === chainId);

      if (chain) {
        try {
          // Try to add the network
          const addResult = await addNetwork(chain);
          if (addResult.success) {
            return {
              success: true,
              message: `${chain.name} added to your wallet. Please try switching again.`,
              type: "success",
            };
          } else {
            return addResult; // Return the error from adding network
          }
        } catch (addError: any) {
          return {
            success: false,
            message: `Failed to add network: ${
              addError.message || "Unknown error"
            }`,
            code: addError.code,
            type: "error",
          };
        }
      }
    }

    // For other errors
    return {
      success: false,
      message: error.message || "Failed to switch network",
      code: error.code,
      type: "error",
    };
  }
}
