import { createContext } from 'react';
import { User, Contract } from '../lib/types';

interface UserContextType {
    user: User | null;
    loginWithGameContract: () => void; //qs: or should it be Promise<void>;
    contract: Contract;
}

export const UserContext = createContext<UserContextType | null>(null);
