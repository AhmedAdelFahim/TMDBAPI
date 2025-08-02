import { Injectable, Logger } from '@nestjs/common';
import R from 'ramda';
import { MoviesRepository } from './movies.repository';
import { IMovie, MovieFilter } from './movies.type';
import { GenreMoviesRepository } from '../genre-movies/genre-movies.repository';
import TABLES from '../database/tables.constant';
import { RedisService } from '../caching/redis.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly genreMoviesRepository: GenreMoviesRepository,
    private readonly redisService: RedisService,
  ) {}

  async filter(filter: MovieFilter) {
    const cachingKey = this.redisService.getKeyForCaching(filter, 'MOVIE_LIST');
    const movies = await this.redisService.getKey(cachingKey);
    if (!R.isNil(movies)) {
      Logger.verbose(`cache hit for ${JSON.stringify(filter)}`);
      return JSON.parse(movies);
    }
    let query = this.moviesRepository
      .query()
      .select(
        `${TABLES.MOVIE}.*`,
        this.moviesRepository
          .knex()
          .raw(`array_agg(${TABLES.GENRE}.name) as genres`),
      )
      .leftJoin(
        TABLES.GENRE_MOVIE,
        `${TABLES.GENRE_MOVIE}.tmdb_movie_id`,
        `${TABLES.MOVIE}.tmdb_movie_id`,
      )
      .leftJoin(
        TABLES.GENRE,
        `${TABLES.GENRE_MOVIE}.tmdb_genre_id`,
        `${TABLES.GENRE}.tmdb_genre_id`,
      )
      .groupBy(`${TABLES.MOVIE}.id`);
    if (!R.isNil(filter.q) && !R.isEmpty(filter.q)) {
      query = query.where((builder) => {
        builder
          .whereILike('title', `%${filter.q}%`)
          .orWhereILike('overview', `%${filter.q}%`);
      });
    }
    if (!R.isNil(filter.genres) && !R.isEmpty(filter.genres)) {
      query = query.havingRaw(`array_agg(genre.tmdb_genre_id) @> ?`, [
        filter.genres,
      ]);
    }
    const results = await query.page(filter.page - 1, filter.limit);
    await this.redisService.setKey(cachingKey, JSON.stringify(results), {
      ttl: 60 * 60, // 1 hour
    });
    Logger.verbose(`cache miss for ${JSON.stringify(filter)}`);
    return results;
  }

  async populateMovies(movies: IMovie[]) {
    await this.moviesRepository.knex().transaction(async (trx: any) => {
      const genres = movies
        .map((movie) => {
          return movie.genre_ids.map((genre) => {
            return {
              tmdb_genre_id: genre,
              tmdb_movie_id: movie.tmdb_movie_id,
            };
          });
        })
        .flat();
      movies = movies.map((movie) => {
        delete movie.genre_ids;
        return movie;
      });
      await this.moviesRepository.createManyOnConflict(movies, { trx });
      await this.genreMoviesRepository.createManyOnConflict(genres, { trx });
    });
  }
}
