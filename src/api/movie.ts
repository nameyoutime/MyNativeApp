import { ENV } from '../config/env';

// Types for TMDB API responses
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  imdb_id: string;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
}

export interface MovieCredits {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }>;
}

export interface AccountDetails {
  avatar: {
    gravatar: {
      hash: string;
    };
  };
  id: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  include_adult: boolean;
  username: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieRecommendationsResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// API configuration
const TMDB_BASE_URL = ENV.TMDB_BASE_URL;
const API_KEY = ENV.TMDB_API_KEY;

// Generic API request function
async function tmdbRequest<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  // Add API key to params
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
  });
  
  // Set search params manually to avoid TypeScript issues
  const queryString = searchParams.toString();
  const fullUrl = `${url.toString()}?${queryString}`;

  const response = await fetch(fullUrl);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Movie API functions

/**
 * Get movies that are currently playing in theaters
 */
export const getNowPlayingMovies = (params: {
  language?: string;
  page?: number;
  region?: string;
} = {}): Promise<PaginatedResponse<Movie>> => {
  return tmdbRequest<PaginatedResponse<Movie>>('/movie/now_playing', params);
};

/**
 * Get a list of movies ordered by popularity
 */
export const getPopularMovies = (params: {
  language?: string;
  page?: number;
  region?: string;
} = {}): Promise<PaginatedResponse<Movie>> => {
  return tmdbRequest<PaginatedResponse<Movie>>('/movie/popular', params);
};

/**
 * Get a list of movies that are being released soon
 */
export const getUpcomingMovies = (params: {
  language?: string;
  page?: number;
  region?: string;
} = {}): Promise<PaginatedResponse<Movie>> => {
  return tmdbRequest<PaginatedResponse<Movie>>('/movie/upcoming', params);
};

/**
 * Get detailed information about a specific movie
 */
export const getMovieDetails = (movieId: number, params: {
  language?: string;
  append_to_response?: string;
} = {}): Promise<MovieDetails> => {
  return tmdbRequest<MovieDetails>(`/movie/${movieId}`, params);
};

/**
 * Get the cast and crew information for a specific movie
 */
export const getMovieCredits = (movieId: number, params: {
  language?: string;
} = {}): Promise<MovieCredits> => {
  return tmdbRequest<MovieCredits>(`/movie/${movieId}/credits`, params);
};

/**
 * Get your account details
 */
export const getAccountDetails = (sessionId: string, params: {
  language?: string;
} = {}): Promise<AccountDetails> => {
  return tmdbRequest<AccountDetails>('/account', { session_id: sessionId, ...params });
};

/**
 * Get a list of recommended movies for a specific movie
 */
export const getMovieRecommendations = (movieId: number, params: {
  language?: string;
  page?: number;
} = {}): Promise<MovieRecommendationsResponse> => {
  return tmdbRequest<MovieRecommendationsResponse>(`/movie/${movieId}/recommendations`, params);
};

// Export all functions as a named export
export const movieAPI = {
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
  getMovieDetails,
  getMovieCredits,
  getAccountDetails,
  getMovieRecommendations,
} as const;