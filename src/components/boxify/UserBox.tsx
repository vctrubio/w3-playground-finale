import { useGame } from '../../hooks/useGame';

function UserBox() {
    const { game } = useGame();

    if (!game) {
        return <div className="text-center">No game data available</div>;
    }

    const userData = {
        account: game.User.address,
        balance: game.User.network.balance,
        network: game.User.network.name,
    };

    return (
        <div className="dark:bg-gray-800 rounded-lg shadow p-4">
            {Object.entries(userData).map(([label, value]) => (
                <div key={label} className="py-2 px-1 border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                    <p className="text-sm text-gray-500 capitalize">{label}</p>
                    <p className="font-mono font-medium truncate">{value}</p>
                </div>
            ))}
        </div>
    );
}

export default UserBox;