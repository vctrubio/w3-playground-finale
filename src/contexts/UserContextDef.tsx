import { createContext } from 'react';
import { User } from '../lib/types';

interface UserContextType {
    user: User | null;
    test: string;
}

export const UserContext = createContext<UserContextType | null>(null);
