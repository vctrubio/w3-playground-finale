import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ethers } from 'ethers';
import { User, Contract } from '../lib/types';

interface UserContextType {
    user: User | null;
    test: string;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const test = 'hello test';

    useEffect(() => {
        console.log("UserProvider mounted");
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            test
        }}>
            {children}
        </UserContext.Provider>
    );
}

