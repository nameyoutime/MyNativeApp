export const ENV = {
  TMDB_ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjYxZWY3YzAxYWFjMzIzNGQ2MTAzMTVhZDIyMTUyMSIsIm5iZiI6MTc2NTI2NDk1MS43MjMsInN1YiI6IjY5MzdjZTM3NGE4MDM5NWI5MmViMWE3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.we_9zq2Kssy66pydHyTS2lkJZF0JkMEIRvU0p7ws1IU',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
} as const;

export type EnvType = typeof ENV;