import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { useGame } from "../hooks/useGame";
import { switchNetwork } from "../lib/rpc-network";
import { useNotifications } from "../hooks/useNotifications";

const NavButton = () => {
    const sepoliaChainID = "11155111";
    const { networkId } = useGame();
    const { showNotification } = useNotifications();

    if (networkId === undefined)
        return null;

    if (networkId !== sepoliaChainID) {
        const handleNetworkSwitch = async () => {
            try {
                const response = await switchNetwork(sepoliaChainID) as ApiResponse;
                showNotification(
                    response.message,
                    response.type || "success"
                );
            } catch (error) {
                showNotification(
                    error instanceof Error ? error.message : "Failed to switch network",
                    "error"
                );
            }
        };

        return (
            <div
                className="bg-purple-600 text-white py-2 px-4 rounded-full text-sm flex items-center m-2 hover:bg-green-600 transition-colors cursor-pointer"
                onClick={handleNetworkSwitch}
            >
                This game requires you to be on the Sepolia testnet.
            </div>
        );
    }

    return null;
};

export function Navbar() {
    return (
        <nav className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow p-4 transition-colors animate-navbar-dropdown">
            <div className="container mx-auto flex justify-between items-center">
                <Logo />
                <NavButton />
                <ThemeToggle />
            </div>
        </nav>
    );
}
