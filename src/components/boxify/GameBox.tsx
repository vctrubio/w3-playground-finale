import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNotifications } from '../../hooks/useNotifications';
import { TOKENS, GameToken } from '../../lib/game.d'; // Import TOKENS from game.d.ts
import { executeContract } from '../../lib/rpc-contract';
import Cooldown from '../Cooldown';

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
      className="overflow-hidden shadow-lg transition-all hover:shadow-xl"
      style={{
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
  const { game, mapBalanceOfToken } = useGame();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<GameToken | null>(null);
  const [targetTokenId, setTargetTokenId] = useState<number | null>(null);

  if (!game) {
    return <div className="text-center">No game data available</div>;
  }

  const userAddress = game.User?.address || '';
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

    } catch (error) {
      console.error(`Error minting ${item.name} (ID: ${item.id}):`, error);

      let errorMessage = `Failed to mint ${item.name}`;

      if (error instanceof Error) {
        const errorString = error.toString();

        const reasonMatch = errorString.match(/reason="([^"]+)"/);
        if (reasonMatch && reasonMatch[1]) {
          errorMessage = reasonMatch[1];
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

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
        const errorString = error.toString();

        // Look for the revert reason pattern in ethers.js errors
        const reasonMatch = errorString.match(/reason="([^"]+)"/);
        if (reasonMatch && reasonMatch[1]) {
          errorMessage = reasonMatch[1];
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      showNotification(errorMessage, "error", 5000);
    } finally {
      setLoading({ ...loading, [actionKey]: false });
    }
  };

  const handleTrade = async () => {
    if (!contract || !selectedToken || targetTokenId === null) {
      showNotification("Please select tokens to trade", "error");
      return;
    }

    // Add check to prevent trading for the same token ID
    if (selectedToken.id === targetTokenId) {
      showNotification("Cannot trade a token for the same token type", "error");
      return;
    }

    const actionKey = `trade-${selectedToken.id}-${targetTokenId}`;
    setLoading({ ...loading, [actionKey]: true });

    try {
      console.log(`Trading ${selectedToken.name} for token ID ${targetTokenId}...`);

      const result = await executeContract({
        contract,
        functionName: 'trade',
        functionArgs: [selectedToken.id, targetTokenId]
      });

      console.log(`Trade result:`, result);
      showNotification(`Successfully traded for token!`, "success");
      setShowTradeModal(false);
      setSelectedToken(null);
      setTargetTokenId(null);
    } catch (error) {
      console.error(`Error trading tokens:`, error);

      // Extract meaningful error message
      let errorMessage = `Failed to trade tokens`;

      if (error instanceof Error) {
        const errorString = error.toString();
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

  const handleTradeClick = () => {
    setShowTradeModal(true);
  };

  //fast style
  const shouldLastItemSpanFull = TOKENS.length % 3 === 1;
  const basketToken = TOKENS.find(item => item.name === "BASKET");
  const bucketColor = basketToken?.color || "#483D6F";

  // Basic tokens (IDs 0-2) that can be traded for
  const basicTokens = TOKENS.filter(token => token.id >= 0 && token.id <= 2);
  return (
    <div className="relative mt-12 mb-4">
      <div
        className="absolute left-1/2 -translate-x-1/2 w-32 h-12 -top-10 rounded-t-full z-10 w-full"
        style={{
          border: `4px solid ${bucketColor}`,
          borderBottom: 'none',
          background: 'transparent',
          textAlign: 'center',
          padding: '0.5rem 24px',
          fontStyle: 'italic',
          fontFamily: 'cursive',
          letterSpacing: '4px',
          display: 'flex',
          justifyContent: 'space-around',
          gap: '0.5rem',
        }}
      >
        <div>collect the collectables <Cooldown/></div>
        <div
          onClick={handleTradeClick}
          className="cursor-pointer px-2 border rounded transition-colors duration-200 dark:border-gray-700 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          trade this
        </div>
      </div>

      {showTradeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Trade Tokens</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Trade any token for basic resources (IDs 0-2)
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select token to trade:</label>
              <div className="grid grid-cols-3 gap-2">
                {TOKENS.filter(token => (mapBalanceOfToken?.(userAddress, token.id) || 0) > 0)
                  .map(token => (
                    <div
                      key={token.id}
                      onClick={() => setSelectedToken(token)}
                      className={`p-2 border rounded cursor-pointer text-center transition-colors ${selectedToken?.id === token.id ? 'ring-2 ring-offset-2' : ''
                        }`}
                      style={{
                        borderColor: token.color,
                        backgroundColor: selectedToken?.id === token.id ? `${token.color}30` : 'transparent'
                      }}
                    >
                      <div className="text-xs mb-1">{token.name}</div>
                      <div className="font-bold">{mapBalanceOfToken?.(userAddress, token.id) || 0}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select token to receive:</label>
              <div className="grid grid-cols-3 gap-2">
                {basicTokens.map(token => {
                  // Determine if this token should be disabled (same as selected token)
                  const isDisabled = selectedToken?.id === token.id;

                  return (
                    <div
                      key={token.id}
                      onClick={() => !isDisabled && setTargetTokenId(token.id)}
                      className={`p-2 border rounded text-center transition-colors ${targetTokenId === token.id ? 'ring-2 ring-offset-2' : ''
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        borderColor: token.color,
                        backgroundColor: targetTokenId === token.id ? `${token.color}30` : 'transparent'
                      }}
                    >
                      <div className=" mb-1">{token.name}</div>
                      {isDisabled && (
                        <div className="text-xs text-red-500 mt-1">Cannot trade for same token</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTradeModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleTrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!selectedToken || targetTokenId === null || loading[`trade-${selectedToken?.id}-${targetTokenId}`]}
              >
                {loading[`trade-${selectedToken?.id}-${targetTokenId}`] ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  'Trade'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto border-l border-r border-b rounded-lg dark:bg-gray-800/30 bg-white/80"
        style={{
          borderColor: bucketColor,
          borderWidth: '4px',
          borderStyle: 'solid',
          borderRadius: shouldLastItemSpanFull && TOKENS.length - 1 ? '0 0 10px 10px' : '10px'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {TOKENS.map((item) => (
            <div
              className={`${shouldLastItemSpanFull && item.id === TOKENS.length - 1 ? 'md:col-span-2 lg:col-span-3' : ''}`}
              key={item.id}
              style={{
                borderColor: item.color,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            >
              <GameEntity
                item={item}
                onMint={handleMint}
                onBurn={handleBurn}
                canBurn={canBurnItem(item.id)}
                loading={loading[`mint-${item.id}`] || loading[`burn-${item.id}`] || false}
                userBalance={mapBalanceOfToken?.(userAddress, item.id) || 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBox;
