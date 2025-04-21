import { useUser } from "../hooks/useUser";
import { hasMetamask } from "../lib/ethers";

function Login() {
    const { loginWithGameContract } = useUser();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <button className="p-2 border rounded-xl">
                Login button here
            </button>
        </div>
    );
}

export default Login;