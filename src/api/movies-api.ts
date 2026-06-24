import { API_BASE_URL, API_KEY } from '../config';
import { mapMovie } from '../mapper/movie.mapper';
import type { Movie, MovieCategory, MovieDto, MoviesPage, MoviesResponseDto } from '../types/movie';

const request = async <T>(path: string, parameters: Record<string, string>): Promise<T> => {
    const url = new URL(`${API_BASE_URL}${path}`);

    url.searchParams.set('api_key', API_KEY);

    Object.entries(parameters).forEach(([name, value]) => {
        url.searchParams.set(name, value);
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMDB request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
};

export const getMoviesByCategory = async (category: MovieCategory, page = 1): Promise<MoviesPage> => {
    const response = await request<MoviesResponseDto>(`/movie/${category}`, { page: String(page) });

    return {
        movies: response.results.map(mapMovie),
        page: response.page,
        totalPages: response.total_pages,
    };
};

export const searchMovies = async (query: string, page = 1): Promise<MoviesPage> => {
    const response = await request<MoviesResponseDto>('/search/movie', {
        page: String(page),
        query,
    });

    return {
        movies: response.results.map(mapMovie),
        page: response.page,
        totalPages: response.total_pages,
    };
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
    const movieDto = await request<MovieDto>(`/movie/${id}`, {});

    return mapMovie(movieDto);
};
