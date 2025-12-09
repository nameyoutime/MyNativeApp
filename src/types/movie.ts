export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface ReleaseDate {
  certification: string;
  iso_639_1: string;
  release_dates: {
    certification: string;
    type: number;
  }[];
}

export interface ReleaseDatesResponse {
  results: {
    iso_3166_1: string;
    release_dates: {
      certification: string;
      type: number;
    }[];
  }[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  original_language: string;
  tagline: string | null;
  credits: Credits;
  recommendations: MovieResponse;
  release_dates: ReleaseDatesResponse;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
