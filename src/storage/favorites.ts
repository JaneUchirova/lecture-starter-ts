const FAVORITE_MOVIES_KEY = 'favoriteMovies';

export const getFavoriteMovieIds = (): number[] => {
    const value = localStorage.getItem(FAVORITE_MOVIES_KEY);

    if (!value) {
        return [];
    }

    try {
        const parsedValue: unknown = JSON.parse(value) as unknown;

        if (!Array.isArray(parsedValue)) {
            return [];
        }

        return parsedValue.filter((id): id is number => typeof id === 'number');
    } catch {
        return [];
    }
};

const saveFavoriteMovieIds = (ids: number[]): void => {
    localStorage.setItem(FAVORITE_MOVIES_KEY, JSON.stringify(ids));
};

export const isFavoriteMovie = (id: number): boolean => getFavoriteMovieIds().includes(id);

export const toggleFavoriteMovie = (id: number): boolean => {
    const favoriteIds = getFavoriteMovieIds();
    const isFavorite = favoriteIds.includes(id);
    const updatedIds = isFavorite ? favoriteIds.filter((favoriteId) => favoriteId !== id) : [...favoriteIds, id];

    saveFavoriteMovieIds(updatedIds);

    return !isFavorite;
};
