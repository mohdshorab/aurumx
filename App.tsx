import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';
import store from './src/store';
import BootSplash from 'react-native-bootsplash';

const App: React.FC = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    </SafeAreaProvider>
  );
};
export default App;
