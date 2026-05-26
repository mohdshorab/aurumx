import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from '../../types/navigation.types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { getMetalDetails } from '../../store/slice/metals.slice';
import Header from '../../components/header/Header';
import AppIcon from '../../components/appIcon/AppIcon';
import styles from './MetalInfo.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'metalInfo'>;

const METAL_META = {
  gold: {
    name: 'Gold',
    color: '#D4AF37',
    bg: '#FCF8E3',
  },
  silver: {
    name: 'Silver',
    color: '#8E8E93',
    bg: '#F2F2F7',
  },
  platinum: {
    name: 'Platinum',
    color: '#3A506B',
    bg: '#EBF1F5',
  },
  palladium: {
    name: 'Palladium',
    color: '#8E44AD',
    bg: '#F5EEF8',
  },
};

const MetalInfo: React.FC<Props> = ({ route, navigation }) => {
  const { metal } = route.params;
  const dispatch = useAppDispatch();
  const { price, timestamp, details, detailsStatus, detailsError } = useAppSelector(
    state => state.metals[metal]
  );
  const meta = METAL_META[metal];

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTimestamp = (isoString: string | null) => {
    if (!isoString) return 'Not available';
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return 'Invalid date';
    }
  };

  const handleBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRefetch = React.useCallback(() => {
    dispatch(getMetalDetails(metal));
  }, [dispatch, metal]);

  useEffect(() => {
    const promise = dispatch(getMetalDetails(metal));
    return () => promise.abort();
  }, [dispatch, metal]);

  const showOfflineBanner = detailsError === 'No internet available to fetch fresh';
  const showQuotaBanner = detailsError === 'Your free transactions limit has ended here';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Header
        title={`${meta.name} Details`}
        showBackButton={true}
        onBackPress={handleBack}
        rightIcon="refresh-outline"
        onRightPress={handleRefetch}
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
        {detailsStatus === 'loading' && price === null ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={meta.color} />
            <Text style={[styles.loadingText, { color: meta.color }]}>Loading details...</Text>
          </View>
        ) : detailsStatus === 'failed' && price === null ? (
          <View style={styles.errorContainer}>
            <AppIcon name="alert-circle-outline" size={48} color="#C62828" style={styles.errorIcon} />
            <Text style={styles.errorText}>
              {detailsError || 'Failed to retrieve metal rate.'}
            </Text>
            <TouchableOpacity onPress={handleRefetch} style={styles.retryButton} activeOpacity={0.7}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : price !== null ? (
          <View>
            <View style={[styles.heroCard, { backgroundColor: meta.bg }]}>
              <Text style={styles.heroTitle}>Live spot rate (24K)</Text>
              <Text style={[styles.heroPrice, { color: meta.color }]}>
                {formatCurrency(price)}
              </Text>
              <Text style={styles.heroUnit}>per gram in INR</Text>
              <Text style={styles.heroTime}>As of {formatTimestamp(timestamp)}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Market Reference Rates</Text>
              <View style={styles.table}>
                {details?.previousClose !== undefined && details?.previousClose !== null && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableLabel}>Previous Close</Text>
                    <Text style={styles.tableValue}>{formatCurrency(details.previousClose)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={meta.color} />
            <Text style={[styles.loadingText, { color: meta.color }]}>Loading details...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MetalInfo;
