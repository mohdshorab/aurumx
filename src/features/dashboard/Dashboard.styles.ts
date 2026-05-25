import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
  },
  gridContainer: {
    padding: 16,
    flexDirection: 'column',
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
});

export default styles;