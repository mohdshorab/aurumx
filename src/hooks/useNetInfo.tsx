import { createContext, useContext } from 'react';
import { useNetInfo, NetInfoState } from '@react-native-community/netinfo';

export const NetContext = createContext<NetInfoState | null>(null);

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const netInfo = useNetInfo();
  return <NetContext.Provider value={netInfo}>{children}</NetContext.Provider>;
};

export default NetworkProvider;

export const useNetwork = () => {
  const context = useContext(NetContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
