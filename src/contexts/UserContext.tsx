import React, { useState, ReactNode, useEffect } from 'react';
import { User } from '../lib/types';
import { UserContext } from './UserContextDef';

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

