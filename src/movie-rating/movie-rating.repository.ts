import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, ICreationOptions } from 'objectionjs-repository';
import { MovieRatingModel } from './movie-rating.model';
import { IMovieRating } from './movie-rating.type';

@Injectable()
export class MovieRatingRepository extends BaseRepository<IMovieRating> {
  constructor(@Inject('KNEX_CONNECTION') knex) {
    super(MovieRatingModel, knex);
  }

  async createManyOnConflict(
    items: IMovieRating[],
    options: ICreationOptions = {},
  ) {
    const results = await this.model
      .query(options?.trx)
      .insert(items)
      .onConflict(this.model.uniqueColumns)
      .merge()
      .returning('*');
    return results;
  }
}
