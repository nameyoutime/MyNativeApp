import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '@env';

export const ENV = {
  TMDB_ACCESS_TOKEN,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} as const;

export type EnvType = typeof ENV;