import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

declare global {
  interface Console {
    tron: typeof Reactotron;
  }
}

if (__DEV__) {
  const tron = Reactotron
    .configure({ name: 'AurumX' })
    .useReactNative()
    .use(reactotronRedux()) // add Redux integration
    .connect();

  // Clear Reactotron on boot
  Reactotron.clear?.();

  // Attach to console for easy access
  console.tron = tron;
}
export default Reactotron;
