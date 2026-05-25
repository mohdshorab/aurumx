import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';
import store from './src/store';
import BootSplash from 'react-native-bootsplash';
import NetworkProvider from './src/hooks/useNetInfo';

const App: React.FC = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <Provider store={store}>
          <RootNavigation />
        </Provider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
};
export default App;
