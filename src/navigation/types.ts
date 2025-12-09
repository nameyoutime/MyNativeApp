import { Movie } from '../types/movie';

export type RootStackParamList = {
  MainTabs: undefined;
  Details: { movie: Movie };
};

export type MainTabParamList = {
  Home: undefined;
  Watchlist: undefined;
};
