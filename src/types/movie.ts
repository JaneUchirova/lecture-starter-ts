export interface MovieDto {
    backdrop_path: string | null;
    id: number;
    overview: string;
    poster_path: string | null;
    release_date: string;
    title: string;
    vote_average: number;
}

export interface MoviesResponseDto {
    page: number;
    results: MovieDto[];
    total_pages: number;
    total_results: number;
}

export interface Movie {
    backdropPath: string | null;
    id: number;
    overview: string;
    posterPath: string | null;
    releaseDate: string;
    title: string;
    rating: number;
}

export type MovieCategory = 'popular' | 'upcoming' | 'top_rated';

export interface MoviesPage {
    movies: Movie[];
    page: number;
    totalPages: number;
}
