# Web3 Playground: ERC1155 Token Collection Game

A Web3 application that demonstrates interaction with ERC1155 smart contracts on the Sepolia testnet. This project showcases token minting, burning, and balance management through a user-friendly interface.

## Project Overview

- Built a user-centric dApp that interacts with ERC1155 smart contracts
- Implemented React context providers for state management and authentication
- Used ethers.js to connect with the Ethereum blockchain
- Implemented React context providers for state management and authentication, see [main.tsx](./src/main.tsx)

## Developer Portfolio Highlights

This project demonstrates expertise in:

- **Web3 Integration**: Seamless connection to Ethereum blockchain using ethers.js
- **React Context Architecture**: Efficient state management across components
- **TypeScript**: Strong typing for enhanced code reliability
- **Real-time Data Flow**: WebSocket implementation for live blockchain events
- **Smart Contract Interaction**: Direct communication with ERC1155 contracts
- **UI/UX Design**: Responsive and intuitive interface with Tailwind CSS
- **Component Architecture**: Modular, reusable UI components

## Development Architecture

### Frontend Structure

- **Components**: Modular UI components in `src/components/`
- **Contexts**: React context providers for state management in `src/contexts/`
- **Hooks**: Custom React hooks for accessing contexts in `src/hooks/`
- **Library**: Core blockchain interaction logic in `src/lib/`

### Type System

- Comprehensive TypeScript declarations in `src/lib/types.d.ts` and `src/lib/window.d.ts`
- Configured in `tsconfig.app.json` for browser compatibility
- ESLint configuration to handle declaration edge cases

### Configuration

- Environment variables in `.env` and `.env.example`
- Tailwind v4 with custom variables and theme settings in `index.css`

## Smart Contract Architecture

The application interacts with two smart contracts deployed on the Sepolia testnet:

1. **[ERC1155 Token Contract](./contracts/Erik.json)**: The base token contract that implements the ERC1155 standard

   - Defines token types (SEED, WATER, SOIL, PLANT, FRUIT, FLOWER, BASKET)
   - Handles core token operations (minting, burning, transfers)
   - Manages token balances and ownership records

2. **[Forge Contract](./contracts/ErikForge.json)**: A logic contract that enables token interactions

   - Controls token minting and burning mechanics
   - Implements cooldown periods between operations
   - Manages the token crafting/combination system

3. **WebSocket Contract Connection**:
   - Located in [src/lib/gameTheory.ts](./src/lib/gameTheory.ts)
   - Establishes a persistent WebSocket connection via Infura
   - Enables real-time event listening for token mints and burns

The contract interaction system is managed through these key files:

- [src/lib/gameTheory.ts](./src/lib/gameTheory.ts): Initializes and configures contract instances
- [src/lib/rpc-events.ts](./src/lib/rpc-events.ts): Handles contract event listeners and event processing
- [src/lib/rpc-contract.ts](./src/lib/rpc-contract.ts): Provides the execution interface for contract functions

## Game Mechanics

The game allows players to:

- Mint basic tokens (SEED, WATER, SOIL) for free
- Combine basic tokens to create advanced tokens:
  - PLANT = SEED + WATER
  - FRUIT = WATER + SOIL
  - FLOWER = SEED + SOIL
  - BASKET = SEED + WATER + SOIL
- View token ownership and balances in real-time
- Track blockchain events related to token operations

## User Architecture

The application implements a comprehensive user management system:

- Authentication through MetaMask or compatible wallets
- User context provider (`GameProvider`) that maintains connection state
- Network detection and automatic switching to Sepolia
- Real-time balance updates and transaction notifications

## Boxify Component Sections

The UI is organized into modular "box" components that encapsulate specific functionality:

- **User Box**: Displays connected wallet information
  - Shows account address, balance, and network
  - Read-only interface for monitoring user state
- **Contract ABI Box**: Provides direct interaction with smart contracts
  - Experimental interface for reading and writing to the blockchain
  - Displays contract functions with parameter inputs
  - Useful for developers to test contract functionality
- **Contract Events Box**: Tracks blockchain events
  - Shows a table view of all minting and burning events
  - Tracks token ownership across all addresses
  - Highlights the current user's activity
- **Game Box**: Main application interface
  - Implements the core collection game required by Metana.io bootcamp
  - Provides intuitive UI for minting and burning tokens
  - Displays user's current token balances
  - First successful web3 application connecting to a custom smart contract

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                       React Application                             │
└─────────────┬───────────────────────────────────────┬───────────────┘
              │                                       │
              ▼                                       ▼
┌─────────────────────────┐               ┌─────────────────────────┐
│   Context Providers     │               │     UI Components       │
│  ┌─────────────────┐    │               │  ┌─────────────────┐    │
│  │  ThemeProvider  │    │               │  │     Navbar      │    │
│  └─────────────────┘    │               │  └─────────────────┘    │
│  ┌─────────────────┐    │               │  ┌─────────────────┐    │
│  │NotificationProv.│    │               │  │  BoxInterface   │    │
│  └─────────────────┘    │               │  └─────────────────┘    │
│  ┌─────────────────┐    │               │  ┌─────────────────┐    │
│  │  GameProvider   │◄───┼───────────────┼─►│  Notifications  │    │
│  └────────┬────────┘    │               │  └─────────────────┘    │
└──────────┬┼─────────────┘               │  ┌─────────────────┐    │
           ││                             │  │     Footer      │    │
           ││                             │  └─────────────────┘    │
           ▼▼                             └─────────────────────────┘
┌────────────────────────────────────────────────────────────────────┐
│                  RPC Module Architecture                           │
│                                                                    │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐     │
│  │ rpc-events.ts │     │rpc-contract.ts│     │   rpc-abi.ts  │     │
│  │               │     │               │     │               │     │
│  │• initListener │     │• executeContr.│     │• parseAbiStr  │     │
│  │• getFilterLogs│     │• Contract     │     │• categorizeAbi│     │
│  │• mapAddressTo │     │  invocation   │     │• formatResp   │     │
│  │• mapTokenTo   │◄────┼───────────────┼────►│               │     │
│  │• mapBalanceOf │     │               │     │               │     │
│  └───────┬───────┘     └───────┬───────┘     └───────────────┘     │
│          │                     │                                   │
│          │                     ▼                                   │
│          │             ┌───────────────┐                           │
│          └────────────►│ rpc-network.ts│                           │
│                        │               │                           │
│                        │• switchNetwork│                           │
│                        │• addNetwork   │                           │
│                        │• networkChains│                           │
│                        └───────┬───────┘                           │
│                                │                                   │
└────────────────────────────────┼───────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                        Data Flow                                   │
│                                                                    │
│  1. User connects wallet via Login component                       │
│  2. GameProvider initializes contract instances                    │
│  3. ContractSocket listens for real-time blockchain events         │
│  4. Components access state via useGame() hook                     │
│  5. User interactions trigger contract calls via executeContrac()  │
│  6. Events update UI in real-time through context subscription     │
└────────────────────────────────────────────────────────────────-───┘
```

## RPC Module System

The application's RPC (Remote Procedure Call) system is organized into specialized modules that manage different aspects of blockchain interaction:

### rpc-events.ts

- **Purpose**: Manages real-time and historical blockchain events
- **Key Functions**:
  - `initListener()`: Sets up WebSocket event handlers for the contract
  - `getFilterLogs()`: Retrieves historical contract events
  - `mapAddressToTokens()`: Maps user addresses to owned tokens
  - `mapTokenToAddresses()`: Maps tokens to their owners
  - `mapBalanceOfToken()`: Gets balance of specific token for an address

### rpc-contract.ts

- **Purpose**: Handles direct contract interaction
- **Key Function**:
  - `executeContract()`: Universal function to call read/write contract methods
  - Automatically detects function type (read/write) and formats transactions

### rpc-abi.ts

- **Purpose**: Parses and processes contract ABIs
- **Key Functions**:
  - `parseAbiString()`: Converts ABI strings to structured objects
  - `parseAndCategorizeAbi()`: Organizes ABI functions by type (read/write/event)
  - `formatContractResponse()`: Formats contract responses for display

### rpc-network.ts

- **Purpose**: Manages blockchain network connections
- **Key Functions**:
  - `switchNetwork()`: Changes the current network in MetaMask
  - `addNetwork()`: Adds new networks to MetaMask
  - `networkChains`: Contains network configurations

The RPC module system provides a clean separation of concerns while maintaining interconnectivity, allowing each component to focus on a specific aspect of blockchain communication.

## See in Production

Experience this dApp live at: [https://w3-metana-vctrubio.vercel.app/](https://w3-metana-vctrubio.vercel.app/)

To interact with the application:

1. Make sure you have MetaMask installed
2. Connect to the Sepolia testnet | it will prompt you if not.
3. Get some Sepolia ETH from a faucet if needed
4. Start playing

## Open for Feedback

I'm actively seeking feedback to improve this project and my development skills. If you have any suggestions, questions, or would like to collaborate, please reach out:

📧 **Email**: [vctrubio@gmail.com](mailto:vctrubio@gmail.com)  
💻 **GitHub**: [github.com/vctrubio](https://github.com/vctrubio)

I appreciate criticism.

Till next next. Adios
