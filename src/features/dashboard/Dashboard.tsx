import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Dashboard.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from '../../types/navigation.types';
import useFetchMetals from '../../hooks/useFetchMetals';

const Dashboard: React.FC<
  NativeStackScreenProps<RootStackParamList, 'dashboard'>
> = ({ navigation }) => {
  const { metals, status, error } = useFetchMetals();

  return (
    <SafeAreaView style={styles.container}>
      <Text>AURUM X</Text>
      <Text>{metals?.status}</Text>
    </SafeAreaView>
  );
};

export default Dashboard;
