import { IMAGE_BASE_URL } from '../config';
import type { Movie } from '../types/movie';

type FavoriteToggleHandler = (movieId: number) => void;

interface MovieCardOptions {
    favorite: boolean;
    favoriteList: boolean;
    onFavoriteToggle: FavoriteToggleHandler;
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const createHeartIcon = (favorite: boolean): SVGSVGElement => {
    const icon = document.createElementNS(SVG_NAMESPACE, 'svg');
    const path = document.createElementNS(SVG_NAMESPACE, 'path');

    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('fill', favorite ? 'red' : 'white');
    icon.setAttribute('height', '34');
    icon.setAttribute('stroke', 'red');
    icon.setAttribute('viewBox', '0 0 16 16');
    icon.setAttribute('width', '34');
    path.setAttribute('d', 'M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z');

    icon.append(path);

    return icon;
};

const createMovieCard = (movie: Movie, options: MovieCardOptions): HTMLDivElement => {
    const column = document.createElement('div');
    const card = document.createElement('article');
    const poster = document.createElement('img');
    const favoriteButton = document.createElement('button');
    const cardBody = document.createElement('div');
    const title = document.createElement('h5');
    const description = document.createElement('p');
    const metadata = document.createElement('small');

    column.className = options.favoriteList ? 'col-12 p-2' : 'col-lg-3 col-md-4 col-12 p-2';
    card.className = 'card shadow-sm h-100';
    poster.className = 'card-img-top movie-poster';
    poster.alt = movie.title;

    if (movie.posterPath) {
        poster.src = `${IMAGE_BASE_URL}${movie.posterPath}`;
    }

    favoriteButton.className = 'btn favorite-button position-absolute border-0 p-2';
    favoriteButton.type = 'button';
    favoriteButton.setAttribute('aria-label', options.favorite ? 'Remove from favorites' : 'Add to favorites');
    favoriteButton.append(createHeartIcon(options.favorite));
    favoriteButton.addEventListener('click', () => {
        options.onFavoriteToggle(movie.id);
    });

    cardBody.className = 'card-body d-flex flex-column';
    title.className = 'card-title';
    title.textContent = movie.title;
    description.className = 'card-text truncate';
    description.textContent = movie.overview || 'Description is unavailable.';
    metadata.className = 'text-muted mt-auto';
    metadata.textContent = `${movie.releaseDate || 'Date unknown'} · ★ ${movie.rating.toFixed(1)}`;

    cardBody.append(title, description, metadata);
    card.append(poster, favoriteButton, cardBody);
    column.append(card);

    return column;
};

export const renderMovies = (
    container: HTMLElement,
    movies: Movie[],
    favoriteIds: number[],
    onFavoriteToggle: FavoriteToggleHandler
): void => {
    container.replaceChildren(
        ...movies.map((movie) =>
            createMovieCard(movie, {
                favorite: favoriteIds.includes(movie.id),
                favoriteList: false,
                onFavoriteToggle,
            })
        )
    );
};

export const renderFavoriteMovies = (
    container: HTMLElement,
    movies: Movie[],
    onFavoriteToggle: FavoriteToggleHandler
): void => {
    if (movies.length === 0) {
        const message = document.createElement('p');

        message.textContent = 'No favorite movies yet.';
        container.replaceChildren(message);

        return;
    }

    container.replaceChildren(
        ...movies.map((movie) =>
            createMovieCard(movie, {
                favorite: true,
                favoriteList: true,
                onFavoriteToggle,
            })
        )
    );
};

export const renderRandomMovie = (
    section: HTMLElement,
    name: HTMLElement,
    description: HTMLElement,
    movies: Movie[]
): void => {
    const sectionElement = section;
    const nameElement = name;
    const descriptionElement = description;
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    if (!randomMovie) {
        nameElement.textContent = 'No movies found';
        descriptionElement.textContent = '';
        sectionElement.style.backgroundImage = '';

        return;
    }

    nameElement.textContent = randomMovie.title;
    descriptionElement.textContent = randomMovie.overview || 'Description is unavailable.';

    if (randomMovie.backdropPath) {
        sectionElement.style.backgroundImage = `linear-gradient(#0006, #0006), url("${IMAGE_BASE_URL}${randomMovie.backdropPath}")`;
    } else {
        sectionElement.style.backgroundImage = '';
    }
};

export const renderMessage = (container: HTMLElement, messageText: string): void => {
    const message = document.createElement('p');

    message.className = 'text-center col-12';
    message.textContent = messageText;
    container.replaceChildren(message);
};
