import { Movie } from '../types/movie';

export type RootStackParamList = {
  MainTabs: undefined;
  HomeScreen: undefined;
  WatchlistScreen: undefined;
  Details: { movie: Movie };
};

export type MainTabParamList = {
  Home: undefined;
  Watchlist: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  Details: { movie: Movie };
};

export type WatchlistStackParamList = {
  WatchlistScreen: undefined;
  Details: { movie: Movie };
};
