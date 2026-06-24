import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/styles.css';

import { getMovieDetails, getMoviesByCategory, searchMovies } from './api/movies-api';
import { renderFavoriteMovies, renderMessage, renderMovies, renderRandomMovie } from './dom/movies';
import { getFavoriteMovieIds, toggleFavoriteMovie } from './storage/favorites';
import type { Movie, MovieCategory, MoviesPage } from './types/movie';

const getElement = <T extends HTMLElement>(id: string): T => {
    const element = document.getElementById(id) as T | null;

    if (!element) {
        throw new Error(`Element with id "${id}" was not found`);
    }

    return element;
};

const getSelector = <T extends Element>(selector: string): T => {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Element with selector "${selector}" was not found`);
    }

    return element;
};

const filmContainer = getElement<HTMLDivElement>('film-container');
const favoriteMoviesContainer = getElement<HTMLDivElement>('favorite-movies');
const randomMovieSection = getElement<HTMLElement>('random-movie');
const randomMovieName = getElement<HTMLHeadingElement>('random-movie-name');
const randomMovieDescription = getElement<HTMLParagraphElement>('random-movie-description');
const searchInput = getElement<HTMLInputElement>('search');
const searchButton = getElement<HTMLButtonElement>('search-submit');
const loadMoreButton = getElement<HTMLButtonElement>('load-more');
const categoryButtons = getElement<HTMLDivElement>('button-wrapper');
const favoriteMenuButton = getSelector<HTMLButtonElement>('button[data-bs-target="#offcanvasRight"]');

favoriteMenuButton.title = 'Favorite movies';
favoriteMenuButton.setAttribute('aria-label', 'Open favorite movies');

let currentCategory: MovieCategory = 'popular';
let currentMovies: Movie[] = [];
let currentPage = 1;
let currentSearchQuery = '';
let totalPages = 1;
let isLoading = false;

const isMovieCategory = (value: string): value is MovieCategory => ['popular', 'upcoming', 'top_rated'].includes(value);

const updateLoadMoreButton = (): void => {
    loadMoreButton.disabled = isLoading || currentPage >= totalPages;
    loadMoreButton.hidden = currentPage >= totalPages;
};

const renderCurrentMovies = (): void => {
    renderMovies(filmContainer, currentMovies, getFavoriteMovieIds(), (movieId) => {
        handleFavoriteToggle(movieId).catch(() => undefined);
    });
};

const loadFavoriteMovies = async (): Promise<void> => {
    const favoriteIds = getFavoriteMovieIds();

    if (favoriteIds.length === 0) {
        renderFavoriteMovies(favoriteMoviesContainer, [], () => undefined);

        return;
    }

    try {
        const movies = await Promise.all(favoriteIds.map((id) => getMovieDetails(id)));

        renderFavoriteMovies(favoriteMoviesContainer, movies, (movieId) => {
            handleFavoriteToggle(movieId).catch(() => undefined);
        });
    } catch {
        renderMessage(favoriteMoviesContainer, 'Could not load favorite movies.');
    }
};

async function handleFavoriteToggle(movieId: number): Promise<void> {
    toggleFavoriteMovie(movieId);
    renderCurrentMovies();
    await loadFavoriteMovies();
}

const requestMovies = (page: number): Promise<MoviesPage> => {
    if (currentSearchQuery) {
        return searchMovies(currentSearchQuery, page);
    }

    return getMoviesByCategory(currentCategory, page);
};

const loadMovies = async (page: number, append: boolean): Promise<void> => {
    if (isLoading) {
        return;
    }

    isLoading = true;
    updateLoadMoreButton();

    try {
        const result = await requestMovies(page);

        currentMovies = append ? [...currentMovies, ...result.movies] : result.movies;
        currentPage = result.page;
        totalPages = result.totalPages;

        renderCurrentMovies();

        if (!append) {
            renderRandomMovie(randomMovieSection, randomMovieName, randomMovieDescription, result.movies);
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown request error';

        renderMessage(filmContainer, message);
    } finally {
        isLoading = false;
        updateLoadMoreButton();
    }
};

const startSearch = (): void => {
    currentSearchQuery = searchInput.value.trim();
    loadMovies(1, false).catch(() => undefined);
};

categoryButtons.addEventListener('change', (event) => {
    const { target } = event;

    if (!(target instanceof HTMLInputElement)) {
        return;
    }

    const { id } = target;

    if (!isMovieCategory(id)) {
        return;
    }

    currentCategory = id;
    currentSearchQuery = '';
    searchInput.value = '';
    loadMovies(1, false).catch(() => undefined);
});

searchButton.addEventListener('click', startSearch);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        startSearch();
    }
});

loadMoreButton.addEventListener('click', () => {
    loadMovies(currentPage + 1, true).catch(() => undefined);
});

const initialize = async (): Promise<void> => {
    filmContainer.replaceChildren();
    favoriteMoviesContainer.replaceChildren();
    await Promise.all([loadMovies(1, false), loadFavoriteMovies()]);
};

initialize().catch(() => undefined);
