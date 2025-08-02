import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, ICreationOptions } from 'objectionjs-repository';
import { GenreMoviesModel } from './genre-movies.model';
import { IGenreMovie } from './genre-movies.type';

@Injectable()
export class GenreMoviesRepository extends BaseRepository<IGenreMovie> {
  constructor(@Inject('KNEX_CONNECTION') knex) {
    super(GenreMoviesModel, knex);
  }

  async createManyOnConflict(
    items: IGenreMovie[],
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
