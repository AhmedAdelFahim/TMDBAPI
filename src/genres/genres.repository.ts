import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, ICreationOptions } from 'objectionjs-repository';
import { GenresModel } from './genres.model';
import { IGenre } from './genres.type';

@Injectable()
export class GenresRepository extends BaseRepository<IGenre> {
  constructor(@Inject('KNEX_CONNECTION') knex) {
    super(GenresModel, knex);
  }

  async createManyOnConflict(items: IGenre[], options: ICreationOptions = {}) {
    const results = await this.model
      .query(options?.trx)
      .insert(items)
      .onConflict(this.model.uniqueColumns)
      .merge()
      .returning('*');
    return results;
  }
}
