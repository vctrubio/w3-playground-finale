import { hasMetamask } from "../lib/ethers";
import { useGame } from "../hooks/useGame";

function Login() {
    const { initGameTheory } = useGame();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {hasMetamask() ? (
                <button
                    className="p-2 border rounded-xl"
                    onClick={initGameTheory}
                >
                    Connect with Metamask
                </button>
            ) : (
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border rounded-xl text-center"
                >
                    Download Metamask to enter the blockchain
                </a>
            )}
        </div>
    );
}

export default Login;