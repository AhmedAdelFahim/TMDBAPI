import { Injectable } from '@nestjs/common';
import path from 'node:path';
import { Model } from 'objection';
import TABLES from '../database/tables.constant';

@Injectable()
export class MoviesModel extends Model {
  static get tableName() {
    return TABLES.MOVIE;
  }

  static get uniqueColumns() {
    return ['tmdb_movie_id'];
  }

  static get relationMappings() {
    return {
      genres: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, '../genres/genres.model'),
        join: {
          from: `${TABLES.MOVIE}.tmdb_movie_id`,
          through: {
            from: `${TABLES.GENRE_MOVIE}.tmdb_movie_id`,
            to: `${TABLES.GENRE_MOVIE}.tmdb_genre_id`,
          },
          to: `${TABLES.GENRE}.tmdb_genre_id`,
        },
      },
    };
  }
}
