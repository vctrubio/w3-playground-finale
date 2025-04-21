import { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNotifications } from '../../hooks/useNotifications';
import { TOKENS, GameToken } from '../../lib/game.d'; // Import TOKENS from game.d.ts
import { executeContract } from '../../lib/rpc-contract';
import { getTokenBalance } from '../../lib/utils';

const GameEntity = ({
  item,
  onMint,
  onBurn,
  canBurn,
  loading,
  userBalance
}: {
  item: GameToken;
  onMint: (item: GameToken) => void;
  onBurn: (item: GameToken) => void;
  canBurn: boolean;
  loading: boolean;
  userBalance: number;
}) => {
  return (
    <div
      className="overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl"
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: item.color,
        background: `linear-gradient(135deg, ${item.color}15, ${item.color}30)`
      }}
    >
      <div
        className="py-3 px-4 font-bold text-lg"
        style={{
          borderBottom: `1px solid ${item.color}40`,
          background: `${item.color}25`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                color: item.color,
                border: `1px solid ${item.color}`,
                backgroundColor: `${item.color}20`
              }}
            >
              {userBalance}
            </div>
            {item.name}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {item.description}
        </p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onMint(item)}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded-lg font-medium text-white transition-all relative overflow-hidden group"
            style={{
              backgroundColor: `${item.color}`,
              boxShadow: `0 2px 10px ${item.color}50`
            }}
          >
            <div className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-white opacity-0 group-hover:opacity-20"></div>
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <span>Mint</span>
            )}
          </button>

          {canBurn && (
            <button
              onClick={() => onBurn(item)}
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-lg font-medium transition-all relative overflow-hidden group"
              style={{
                color: item.color,
                border: `1px solid ${item.color}`,
                backgroundColor: 'transparent'
              }}
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 ease-out opacity-0 group-hover:opacity-10"
                style={{ backgroundColor: item.color }}></div>
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 rounded-full animate-spin"
                    style={{ borderColor: `${item.color}`, borderTopColor: 'transparent' }}></div>
                </div>
              ) : (
                <span>Burn</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function GameBox() {
  const { game } = useGame();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  if (!game) {
    return <div className="text-center">No game data available</div>;
  }

  //useEffect to migrate



  //get contract instance and rules
  const contract = game.ContractForge;
  const canBurnItem = (id: number) => id >= 3 && id <= 7;


  const handleMint = async (item: GameToken) => {
    if (!contract) {
      console.log('No contract available. Please connect wallet first.');
      return;
    }

    const actionKey = `mint-${item.id}`;
    setLoading({ ...loading, [actionKey]: true });

    try {
      console.log(`Starting to mint ${item.name}...`);
      console.log(`Executing "mint" on contract with arg:`, item.id);

      const result = await executeContract({
        contract,
        functionName: 'mint',
        functionArgs: [item.id]
      });

      console.log(`Mint result for ${item.name} (ID: ${item.id}):`, result);

      if (result && result.hash) {
        console.log(`Successfully minted ${item.name}! Transaction: ${result.hash}`);
      } else {
        console.log(`${item.name} minted successfully!`);
      }
    } catch (error) {
      console.error(`Error minting ${item.name} (ID: ${item.id}):`, error);

      // Extract meaningful error message
      let errorMessage = `Failed to mint ${item.name}`;

      if (error instanceof Error) {
        // Check if this is a blockchain revert error with a reason
        const errorString = error.toString();

        // Look for the revert reason pattern in ethers.js errors
        const reasonMatch = errorString.match(/reason="([^"]+)"/);
        if (reasonMatch && reasonMatch[1]) {
          errorMessage = reasonMatch[1];
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      // Show user-friendly notification
      showNotification(errorMessage, "error", 5000);
    } finally {
      setLoading({ ...loading, [actionKey]: false });
    }
  };

  const handleBurn = async (item: GameToken) => {
    if (!contract) {
      console.log('No contract available. Please connect wallet first.');
      return;
    }

    if (!canBurnItem(item.id)) {
      console.log(`${item.name} cannot be burned`);
      return;
    }

    const actionKey = `burn-${item.id}`;
    setLoading({ ...loading, [actionKey]: true });

    try {
      console.log(`Starting to burn ${item.name}...`);
      console.log(`Executing "burn" on contract with arg:`, item.id);

      const result = await executeContract({
        contract,
        functionName: 'burn',
        functionArgs: [item.id]
      });

      console.log(`Burn result for ${item.name} (ID: ${item.id}):`, result);

      if (result && result.hash) {
        console.log(`Successfully burned ${item.name}! Transaction: ${result.hash}`);
      } else {
        console.log(`${item.name} burned successfully!`);
      }
    } catch (error) {
      console.error(`Error burning ${item.name} (ID: ${item.id}):`, error);

      // Extract meaningful error message
      let errorMessage = `Failed to burn ${item.name}`;

      if (error instanceof Error) {
        // Check if this is a blockchain revert error with a reason
        const errorString = error.toString();

        // Look for the revert reason pattern in ethers.js errors
        const reasonMatch = errorString.match(/reason="([^"]+)"/);
        if (reasonMatch && reasonMatch[1]) {
          errorMessage = reasonMatch[1];
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      // Show user-friendly notification
      showNotification(errorMessage, "error", 5000);
    } finally {
      setLoading({ ...loading, [actionKey]: false });
    }
  };



  //fast style
  const shouldLastItemSpanFull = TOKENS.length % 3 === 1;
  const basketToken = TOKENS.find(item => item.name === "BASKET");
  const bucketColor = basketToken?.color || "#483D6F";

  return (
    <div className="relative mt-12 mb-4">
      <div
        className="absolute left-1/2 -translate-x-1/2 w-32 h-12 -top-10 rounded-t-full z-10 w-full"
        style={{
          border: `4px solid ${bucketColor}`,
          borderBottom: 'none',
          background: 'transparent',
          textAlign: 'center',
          padding: '0.5rem',
          fontStyle: 'italic',
          fontFamily: 'cursive',
          letterSpacing: '4px',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
        }}

      >
        <div>
          collect the collectables
        </div>
        <div>xx</div>
      </div>

      <div className="p-6 max-w-5xl mx-auto border-l border-r border-b rounded-lg dark:bg-gray-800/30 bg-white/80"
        style={{
          borderColor: bucketColor,
          borderRadius: '10px 10px 20px 20px', // More rounded at the bottom
          boxShadow: `0 4px 12px ${bucketColor}40`,
          borderWidth: '4px',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOKENS.map((item) => (
            <div
              key={item.id}
              className={`${shouldLastItemSpanFull && item.id === TOKENS.length - 1 ? 'md:col-span-2 lg:col-span-3' : ''}`}
            >
              <GameEntity
                item={item}
                onMint={handleMint}
                onBurn={handleBurn}
                canBurn={canBurnItem(item.id)}
                loading={loading[`mint-${item.id}`] || loading[`burn-${item.id}`] || false}
                userBalance={0}
              // userBalance={balances[item.id] || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBox;
