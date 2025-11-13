// auth-context.tsx
import { createContext, ReactNode, useEffect, useState } from 'react';
import { IUser } from '../index.types';
import { constants } from '@api/config/constants';

type AuthContextType = {
  user: IUser | null;
  logout: () => void;
  setUser: (userData: IUser) => void;
  refresh: boolean;
  addUserToStorage:(data:IUser)=> void
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    setRefresh(true);
    const storedUser = localStorage.getItem('admin');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setRefresh(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin');
    localStorage.removeItem(constants.TOKEN);
  };

  const addUserToStorage = (data: IUser) => {
    console.log("data",data)
    localStorage.setItem('admin', JSON.stringify(data));
    localStorage.setItem(constants.TOKEN, data.access_token);
    setUser(data);
  };

  return <AuthContext.Provider value={{ user, logout, setUser, refresh, addUserToStorage }}>{children}</AuthContext.Provider>;
};
