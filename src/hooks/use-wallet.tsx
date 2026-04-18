import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'issuer' | 'bidder' | 'auditor';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('bidder');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    // Mocking ethers.js connection
    setTimeout(() => {
      setAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      setIsConnected(true);
      setChainId(1);
      setIsConnecting(false);
    }, 1000);
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
  };

  return (
    <WalletContext.Provider value={{ address, isConnected, isConnecting, connect, disconnect, chainId }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
