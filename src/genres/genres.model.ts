import { Injectable } from '@nestjs/common';
import { Model } from 'objection';
import TABLES from '../database/tables.constant';

@Injectable()
export class GenresModel extends Model {
  static get tableName() {
    return TABLES.GENRE;
  }

  static get uniqueColumns() {
    return ['tmdb_genre_id', 'genre_type'];
  }
}
