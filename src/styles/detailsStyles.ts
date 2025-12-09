import { StyleSheet } from 'react-native';
import { responsiveFontSize } from '../utils/responsive';

export const detailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#00B4E4',
  },
  containerInfo: {
    backgroundColor: '#0399c2',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  navTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(18),
  },
  mainInfo: {
    flexDirection: 'row',
    padding: 20,
  },
  poster: {
    width: 120,
    height: 150,
    borderRadius: 5,
  },
  infoContent: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  certBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  certText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: responsiveFontSize(16),
  },
  metaText: {
    color: 'white',
    fontSize: responsiveFontSize(16),
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 2,
    fontSize: responsiveFontSize(16),
  },
  statusLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusValue: {
    color: 'white',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 34,
  },
  scoreContainer: {
    marginRight: 30,
    width: '45%',
  },
  scoreLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(18),
    marginTop: 4,
  },
  crewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  crewItem: {
    marginRight: 20,
    marginBottom: 10,
  },
  crewName: {
    color: 'white',
    fontWeight: '600',
    fontSize: responsiveFontSize(16),
  },
  crewJob: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: responsiveFontSize(16),
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tagline: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginBottom: 10,
    fontSize: responsiveFontSize(20),
  },
  overviewTitle: {
    color: 'white',
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overviewText: {
    color: 'white',
    fontSize: responsiveFontSize(16),
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  watchlistButton: {
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    gap: 10,
    marginTop: 34,
    marginBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  watchlistButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: responsiveFontSize(18),
  },
  sectionContainer: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: '600',
    color: 'black',
    marginLeft: 20,
    marginBottom: 15,
  },
  castCard: {
    width: 139,
    marginRight: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  castImage: {
    width: '100%',
    height: 154,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    backgroundColor: '#ccc',
    objectFit: 'cover',
  },
  castInfo: {
    padding: 10,
  },
  castName: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(14),
    color: 'black',
  },
  castRole: {
    fontSize: responsiveFontSize(16),
    color: '#666',
  },
  recContainer: {
    marginTop: 35,
    borderTopWidth: 1,
    paddingTop: 25,
    borderColor: '#E4E4E4',
  },
  recCard: {
    width: 280,
    marginRight: 15,
    marginBottom: 10,
  },
  recImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  recInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  recTitle: {
    flex: 1,
    fontSize: responsiveFontSize(18),
    color: 'black',
  },
  recRating: {
    marginLeft: 10,
    fontSize: responsiveFontSize(18),
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(16),
    marginTop: 10,
  },
});
