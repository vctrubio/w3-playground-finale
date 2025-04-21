import { useUser } from "../hooks/useUser";

function Dev() {
    const { user, loginWithGameContract } = useUser();
    console.log("user", user);
    return (
        <div>
            <h1>Dev</h1>
            {user ? (
                <div>
                    <h2>User</h2>
                </div>
            ) : (
                <div>
                    <h2>No User</h2>
                </div>
            )}
            <button onClick={loginWithGameContract}>Login with Game Contract</button>
        </div>
    );
}
export default Dev;