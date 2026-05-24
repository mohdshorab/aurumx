import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dashboard from './src/features/dashboard';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <Dashboard />
    </SafeAreaProvider>
  );
};
export default App;
