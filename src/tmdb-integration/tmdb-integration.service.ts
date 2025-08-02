import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoviesTypes } from './tmdb-integration.type';
import axios from 'axios';
import { JobsManagerService } from '../jobs-manager/jobs-manager.service';
import { IMovie } from '../movies/movies.type';
import { MoviesService } from '../movies/movies.service';
import { IGenre } from '../genres/genres.type';
import { GenresService } from '../genres/genres.service';

@Injectable()
export class TMDBIntegrationService {
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly API_KEY;
  private readonly MOVIE_TYPES_URL = {
    [MoviesTypes.NOW_PLAYING]: '/movie/now_playing',
  };
  constructor(
    private readonly configService: ConfigService,
    private readonly moviesService: MoviesService,
    private readonly genresService: GenresService,
    private readonly jobsManagerService: JobsManagerService,
  ) {
    this.API_KEY = configService.get<string>('app.tmdbAPIKEY');
  }

  async populateGenres() {
    try {
      const response = await axios({
        method: 'get',
        baseURL: this.BASE_URL,
        url: 'genre/movie/list',
        headers: { Authorization: `Bearer ${this.API_KEY}` },
      });
      await this.genresService.upsert(
        this.mapGenresResult(response.data.genres),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getMovies({ type, page }: { type: MoviesTypes; page: number }) {
    const url = this.MOVIE_TYPES_URL[type];
    try {
      const response = await axios({
        method: 'get',
        baseURL: this.BASE_URL,
        url,
        headers: { Authorization: `Bearer ${this.API_KEY}` },
        params: {
          page,
        },
      });
      // todo:: save movies
      const mappedMovies = await this.mapMoviesResult(
        response.data.results,
        type,
      );
      await this.moviesService.populateMovies(mappedMovies);
      if (page < response.data.total_pages) {
        await this.jobsManagerService.addJob(
          'populateMovies',
          {
            type,
            page: page + 1,
          },
          {
            removeOnComplete: true,
            removeOnFail: true,
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async mapMoviesResult(results, type: MoviesTypes) {
    // const genres = await this.genresService.getAll();
    // const mappedGenres = genres.reduce((acc, genre: IGenre) => {
    //   acc[genre.tmdb_genre_id] = genre.name;
    //   return acc;
    // }, {});
    return results.map((movie): IMovie => {
      return {
        title: movie.title,
        tmdb_movie_id: movie.id,
        original_title: movie.original_title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        movie_type: type,
        release_date:
          (movie?.release_date || '').length > 0 ? movie?.release_date : null,
        genre_ids: movie.genre_ids,
      };
    });
  }

  mapGenresResult(genres) {
    return genres.map((genre): IGenre => {
      return {
        tmdb_genre_id: genre.id,
        name: genre.name,
      };
    });
  }
}
