import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#F8F9FA',
  },
  heroCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  heroTitle: {
    fontSize: 14,
    color: '#546E7A',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heroPrice: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 6,
  },
  heroUnit: {
    fontSize: 12,
    color: '#78909C',
    fontWeight: '500',
  },
  heroTime: {
    fontSize: 11,
    color: '#78909C',
    marginTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: 10,
    marginLeft: 4,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  tableLabel: {
    fontSize: 14,
    color: '#546E7A',
    fontWeight: '500',
  },
  tableValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  offlineIcon: {
    marginRight: 8,
  },
  offlineText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '600',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#C62828',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#C62828',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
