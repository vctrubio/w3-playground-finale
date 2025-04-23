import { hasMetamask } from "../lib/ethers";

// Add onLogin prop to the component
function Login({ onLogin }: { onLogin: () => Promise<any> }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-screen">
            {hasMetamask() ? (
                <div
                    className="p-6 cursor-pointer rounded-2xl hover:bg-gray-100/20 dark:hover:bg-gray-800/20 transition-colors"
                    onClick={onLogin} // Use the passed handler instead of directly using useGame
                >
                    <button
                        className="p-3 px-6 border border-gray-300 dark:border-gray-600 rounded-xl 
                        bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                        shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,100,0.25)]
                        hover:shadow-[0_15px_30px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_15px_30px_rgba(147,51,234,0.3)]
                        transform hover:scale-105 active:scale-95 
                        transition-all duration-300 ease-in-out
                        hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600
                        hover:text-white hover:border-transparent
                        focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                        relative overflow-hidden
                        animate-[bounce_1s_ease-in-out_infinite]
                        before:content-[''] before:absolute before:w-full before:h-full before:top-0 before:left-0
                        before:bg-gradient-to-r before:from-blue-400/20 before:to-purple-500/20 before:opacity-0
                        hover:before:opacity-100 before:transition-opacity before:duration-500"
                    >
                        <div className="font-bold text-lg">
                            Connect with Metamask
                        </div>
                        <div className="text-sm opacity-80">And play on the sepolia network</div>
                    </button>
                </div>
            ) : (
                <div className="p-6 cursor-pointer rounded-2xl hover:bg-gray-100/20 dark:hover:bg-gray-800/20 transition-colors">
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 px-8 border border-gray-300 dark:border-gray-600 rounded-xl 
                        bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                        shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,100,0.2)]
                        hover:shadow-[0_8px_20px_rgba(246,173,85,0.3)] dark:hover:shadow-[0_8px_20px_rgba(246,173,85,0.2)]
                        transform hover:translate-y-[-2px] active:translate-y-[1px]
                        transition-all duration-300 ease-in-out
                        hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500
                        hover:text-white hover:border-transparent
                        focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500
                        relative overflow-hidden text-center"
                    >
                        <div className="font-bold text-2xl">
                            Download Metamask
                        </div>
                        <div className="text-lg opacity-80 mt-4">
                            Required to access the blockchain - it's quick & easy!
                        </div>
                    </a>
                </div>
            )}
        </div>
    );
}

export default Login;