import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, ICreationOptions } from 'objectionjs-repository';
import { MoviesModel } from './movies.model';
import { IMovie } from './movies.type';

@Injectable()
export class MoviesRepository extends BaseRepository<IMovie> {
  constructor(@Inject('KNEX_CONNECTION') knex) {
    super(MoviesModel, knex);
  }

  async createManyOnConflict(movies: IMovie[], options: ICreationOptions = {}) {
    const results = await this.model
      .query(options?.trx)
      .insert(movies)
      .onConflict(this.model.uniqueColumns)
      .merge()
      .returning('*');
    return results;
  }
}
