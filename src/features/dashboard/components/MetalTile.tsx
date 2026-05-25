import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import useFetchMetal from '../../../hooks/useFetchMetals';
import { MetalType } from '../../../store/slice/metals.slice';
import AppIcon from '../../../components/appIcon/AppIcon';

export interface MetalTileProps {
  metal: MetalType;
}

const METAL_CONFIG: Record<
  MetalType,
  { label: string; activeColor: string; bgHighlight: string }
> = {
  gold: {
    label: 'Gold (24K)',
    activeColor: '#D4AF37',
    bgHighlight: '#FCF8E3',
  },
  silver: {
    label: 'Silver',
    activeColor: '#8E8E93',
    bgHighlight: '#F2F2F7',
  },
  platinum: {
    label: 'Platinum',
    activeColor: '#3A506B',
    bgHighlight: '#EBF1F5',
  },
  palladium: {
    label: 'Palladium',
    activeColor: '#8E44AD',
    bgHighlight: '#F5EEF8',
  },
};

const MetalTile: React.FC<MetalTileProps> = ({ metal }) => {
  const { price, status, timestamp, error, refetch } = useFetchMetal(metal);
  const config = METAL_CONFIG[metal];

  const formatTimestamp = (isoString: string | null) => {
    if (!isoString) return 'Not fetched yet';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <View style={[styles.card, { borderLeftColor: config.activeColor }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.metalLabel}>{config.label}</Text>
        <TouchableOpacity onPress={refetch} style={styles.refreshButton} activeOpacity={0.7}>
          <AppIcon name="refresh-outline" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        {status === 'loading' && price === null ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={config.activeColor} />
            <Text style={[styles.loadingText, { color: config.activeColor }]}>Updating...</Text>
          </View>
        ) : price !== null ? (
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={styles.unitText}>per gram</Text>
          </View>
        ) : status === 'failed' ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} numberOfLines={1}>
              {error || 'Failed to update'}
            </Text>
            <TouchableOpacity onPress={refetch} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>



      <View style={styles.cardFooter}>
        <AppIcon name="time-outline" size={12} color="#8E8E93" style={styles.timeIcon} />
        <Text style={styles.timestampText}>
          {status === 'loading' ? 'Updating...' : `As of ${formatTimestamp(timestamp)}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 6,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metalLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    fontFamily: 'System',
  },
  refreshButton: {
    padding: 6,
  },
  cardBody: {
    minHeight: 52,
    justifyContent: 'center',
    marginVertical: 4,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'System',
  },
  unitText: {
    fontSize: 12,
    color: '#78909C',
    marginLeft: 6,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 14,
    color: '#78909C',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#C62828',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  retryButton: {
    backgroundColor: '#C62828',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingTop: 10,
    marginTop: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  timestampText: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '400',
  },
});

export default MetalTile;
