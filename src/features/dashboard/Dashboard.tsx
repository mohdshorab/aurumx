import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Dashboard.styles';
import { ScreenProps } from './types/dashboard';
import Header from '../../components/header/Header';
import MetalTile from './components/MetalTile';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getMetalPrice } from '../../store/slice/metals.slice';
import AppIcon from '../../components/appIcon/AppIcon';

const Dashboard: React.FC<ScreenProps> = () => {
  const dispatch = useAppDispatch();
  const { gold, silver, platinum, palladium } = useAppSelector(state => state.metals);

  const showOfflineBanner =
    gold.error === 'No internet available to fetch fresh' ||
    silver.error === 'No internet available to fetch fresh' ||
    platinum.error === 'No internet available to fetch fresh' ||
    palladium.error === 'No internet available to fetch fresh';

  const showQuotaBanner =
    gold.error === 'Your free transactions limit has ended here' ||
    silver.error === 'Your free transactions limit has ended here' ||
    platinum.error === 'Your free transactions limit has ended here' ||
    palladium.error === 'Your free transactions limit has ended here';

  const handleRefreshAll = React.useCallback(() => {
    dispatch(getMetalPrice('gold'));
    dispatch(getMetalPrice('silver'));
    dispatch(getMetalPrice('platinum'));
    dispatch(getMetalPrice('palladium'));
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Header
        title="AURUM X"
        rightIcon="refresh"
        onRightPress={handleRefreshAll}
      />
      {showOfflineBanner && (
        <View style={styles.offlineBanner}>
          <AppIcon name="wifi-outline" size={16} color="#E65100" style={styles.offlineIcon} />
          <Text style={styles.offlineText}>No internet available to fetch fresh</Text>
        </View>
      )}
      {showQuotaBanner && (
        <View style={styles.offlineBanner}>
          <AppIcon name="alert-circle-outline" size={16} color="#E65100" style={styles.offlineIcon} />
          <Text style={styles.offlineText}>Your free transactions limit has ended here. Showing cached data.</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          <MetalTile metal="gold" />
          <MetalTile metal="silver" />
          <MetalTile metal="platinum" />
          <MetalTile metal="palladium" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
