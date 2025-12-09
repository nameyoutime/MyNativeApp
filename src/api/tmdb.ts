import axios from 'axios';
import { ENV } from '../config/env';
import { MovieResponse, MovieDetails } from '../types/movie';
import { MovieCategory } from '../redux/slices/settingsSlice';

const api = axios.create({
  baseURL: ENV.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${ENV.TMDB_ACCESS_TOKEN}`,
  },
  params: {
    api_key: ENV.TMDB_ACCESS_TOKEN,
    language: 'en-US',
  },

});

export const fetchMovies = async (
  category: MovieCategory,
  query?: string,
  page: number = 1
): Promise<MovieResponse> => {
  if (query && query.trim().length > 0) {
    // If there is a search query, use the search endpoint
    // Note: The TMDB search API searches globally. 
    // Strictly combining "Now Playing" filter with strict text search is complex via standard endpoints.
    // For this implementation, we prioritize the search keyword.
    const response = await api.get<MovieResponse>('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } else {
    // Map internal category to API endpoint path
    let endpoint = 'popular'; // default
    switch (category) {
      case 'now_playing':
        endpoint = 'now_playing';
        break;
      case 'upcoming':
        endpoint = 'upcoming';
        break;
      case 'popular':
        endpoint = 'popular';
        break;
    }
    const response = await api.get<MovieResponse>(`/movie/${endpoint}`, {
      params: {
        page,
      },
    });
    return response.data;
  }
};

export const fetchMovieDetails = async (id: number) => {
  const response = await api.get<MovieDetails>(`/movie/${id}`, {
    params: {
      append_to_response: 'credits,recommendations,release_dates',
    },
  });
  return response.data;
};

export const fetchAccountDetails = async () => {
  // Using the session_id or just the token if V4/V3 allows. 
  // For V3 with Bearer token, /account usually returns the account details for the owner of the token.
  try {
    const response = await api.get('/account');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch account details', error);
    return null;
  }
};
