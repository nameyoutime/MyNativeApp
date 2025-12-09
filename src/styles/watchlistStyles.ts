import { StyleSheet } from 'react-native';
import { responsiveFontSize } from '../utils/responsive';

export const watchlistStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#042541',
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 10,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9747FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: responsiveFontSize(36),
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
  },
  joinedDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: responsiveFontSize(16),
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    zIndex: 10,
  },
  filterLabel: {
    fontSize: responsiveFontSize(16),
    color: '#828282',
    marginRight: 10,
  },
  orderLabel: {
    fontSize: responsiveFontSize(16),
    color: '#828282',
    marginLeft: 20,
    marginRight: 5,
  },
  dropdown: {
    width: 120,
    height: 30,
    borderBottomColor: '#01b4e4',
    borderBottomWidth: 2,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(16),
    color: '#01b4e4',
    fontWeight: '600',
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(16),
    color: '#01b4e4',
    fontWeight: '600',
  },
  arrowIcon: {
    fontSize: responsiveFontSize(20),
    color: '#000',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  poster: {
    width: 100,
    height: 146,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 21,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  movieTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    fontSize: responsiveFontSize(24),
    color: '#666',
    lineHeight: 24,
    marginTop: -5,
  },
  releaseDate: {
    fontSize: responsiveFontSize(14),
    color: '#999',
    marginBottom: 8,
  },
  overview: {
    fontSize: responsiveFontSize(14),
    color: '#333',
    lineHeight: 20,
    marginTop: 17,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: responsiveFontSize(16),
    color: '#666',
  },
});
