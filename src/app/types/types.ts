// For Google Analytics
export interface EventParams {
  action: string;
  category: string;
  label: string;
  value?: number;
}
// For Search 
export interface SearchResult {
  backdrop_path:     null | string;
  id:                number;
  name?:             string;
  original_name?:    string;
  overview:          string;
  poster_path:       null | string;
  media_type:        string;
  adult:             boolean;
  original_language: string;
  genre_ids:         number[];
  popularity:        number;
  first_air_date?:   string;
  vote_average:      number;
  vote_count:        number;
  origin_country?:   string[];
  title?:            string;
  original_title?:   string;
  release_date?:     string;
  video?:            boolean;
}
// MediaItem represents a common structure for both movies and TV shows
export interface MediaItem {
  id: number;
  title?: string; // For movies
  name?: string; // For TV shows
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  media_type: string; // Can be "movie" or "tv"
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  video?: boolean;
  vote_average: number;
  vote_count: number;
  origin_country?: string[]; // For TV shows
}

// Movie interface representing detailed movie information
export interface Movie {
  popularity: number;
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

// Video interface representing video information related to movies or TV shows
export interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

// BelongsToCollection interface representing movie collections
export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

// Genre interface representing genre details
export interface Genre {
  id: number;
  name: string;
}

// ProductionCompany interface representing production companies
export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

// ProductionCountry interface representing production countries
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// SpokenLanguage interface representing spoken languages
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// MovieDetails interface representing detailed movie information
export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  seasons: [];
}

// TVShow interface representing basic TV show information
export interface TVShow {
  popularity: number;
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

// TVShowVideo interface representing video information related to TV shows
export interface TVShowVideo {
  key: string;
  name: string;
  site: string;
  type: string;
}

// TVShowCollection interface representing TV show collections
export interface TVShowCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

// TVShowGenre interface representing genre details specific to TV shows
export interface TVShowGenre {
  id: number;
  name: string;
}

// TVShowProductionCompany interface representing production companies for TV shows
export interface TVShowProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

// TVShowProductionCountry interface representing production countries for TV shows
export interface TVShowProductionCountry {
  iso_3166_1: string;
  name: string;
}

// TVShowSpokenLanguage interface representing spoken languages for TV shows
export interface TVShowSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// TVShowDetails interface representing detailed TV show information
export interface TVShowDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: TVShowCollection;
  episode_run_time: number[];
  first_air_date: string;
  genres: TVShowGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air?: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  };
  name: string;
  next_episode_to_air?: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  };
  networks: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: TVShowProductionCompany[];
  production_countries: TVShowProductionCountry[];
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }>;
  spoken_languages: TVShowSpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
}
export interface SeasonDetails {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}