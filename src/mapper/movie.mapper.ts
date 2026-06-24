import type { Movie, MovieDto } from '../types/movie';

export const mapMovie = (movieDto: MovieDto): Movie => ({
    backdropPath: movieDto.backdrop_path,
    id: movieDto.id,
    overview: movieDto.overview,
    posterPath: movieDto.poster_path,
    releaseDate: movieDto.release_date,
    title: movieDto.title,
    rating: movieDto.vote_average,
});
