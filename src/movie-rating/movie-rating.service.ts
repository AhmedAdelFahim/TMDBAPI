import { Injectable } from '@nestjs/common';
import { MovieRatingRepository } from './movie-rating.repository';
import { MoviesRepository } from '../movies/movies.repository';

@Injectable()
export class MovieRatingService {
  constructor(
    private readonly movieRatingRepository: MovieRatingRepository,
    private readonly moviesRepository: MoviesRepository,
  ) {}

  async rateMovie(movie_id: number, user_id: number, rating: number) {
    let newRate;
    await this.movieRatingRepository.knex().transaction(async (trx) => {
      await this.movieRatingRepository.createManyOnConflict(
        [
          {
            user_id,
            movie_id,
            rating,
          },
        ],
        { trx },
      );
      newRate = await this.movieRatingRepository.model
        .query(trx)
        .select(
          this.movieRatingRepository
            .knex()
            .raw(`count(*) as rate_count, avg(rating) as rate`),
        )
        .where('movie_id', movie_id)
        .first();
      await this.moviesRepository.update(
        { id: movie_id },
        { rate: newRate.rate, rate_count: newRate.rate_count },
        { trx },
      );
    });
    return newRate;
  }
}
