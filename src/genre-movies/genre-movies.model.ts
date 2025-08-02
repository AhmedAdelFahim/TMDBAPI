import { Injectable } from '@nestjs/common';
import { Model } from 'objection';
import TABLES from '../database/tables.constant';

@Injectable()
export class GenreMoviesModel extends Model {
  static get tableName() {
    return TABLES.GENRE_MOVIE;
  }

  static get uniqueColumns() {
    return ['tmdb_genre_id', 'tmdb_movie_id'];
  }
}
