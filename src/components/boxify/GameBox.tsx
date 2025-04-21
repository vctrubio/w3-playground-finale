import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNotifications } from '../../hooks/useNotifications';
import { TOKENS } from '../../lib/game.d'; // Import TOKENS from game.d.ts

function GameBox() {
  const { game } = useGame();
  const { showNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  if (!game) {
    return <div className="text-center">No game data available</div>;
  }

  const handleMintToken = async (tokenId: number) => {
    if (!game.ContractForge) return;

    setIsLoading(true);
    try {
      const tx = await game.ContractForge.instance.mint(tokenId);
      await tx.wait();
      showNotification(`Successfully minted token #${tokenId}!`, "success");
    } catch (error) {
      console.error('Error minting token:', error);
      showNotification(`Failed to mint token: ${(error as Error).message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {TOKENS.map(token => (
        <div key={token.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-2">{token.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{token.description}</p>
          <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: token.color }}></div>
          <button
            onClick={() => handleMintToken(token.id)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Processing...' : `Mint ${token.name}`}
          </button>
        </div>
      ))}
    </div>
  );
}

export default GameBox;
