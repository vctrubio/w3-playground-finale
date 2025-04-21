import { useState, ReactNode, useEffect } from 'react';
import { User, Contract } from '../lib/types';
import { UserContext } from './UserContextDef';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user] = useState<User | null>(null);

    useEffect(() => {
        console.log("UserProvider mounted");
    }, []);

    const loginWithGameContract = async () => {
        console.log("loginWithGameContract called");
    }

    return (
        <UserContext.Provider value={{
            user,
            loginWithGameContract,
            contract: {} as Contract,
        }}>
            {children}
        </UserContext.Provider>
    );
}

