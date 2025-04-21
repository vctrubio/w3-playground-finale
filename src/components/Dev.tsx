import { useUser } from "../hooks/useUser";

function Dev() {
    const { user, test } = useUser();
    console.log("user", user);
    console.log("test", test);
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
        </div>
    );
}
export default Dev;