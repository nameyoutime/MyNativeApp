export const ENV = {
  TMDB_API_KEY: 'your-tmdb-api-key-here',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
} as const;

export type EnvType = typeof ENV;