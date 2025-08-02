import { Injectable } from '@nestjs/common';
import { Model } from 'objection';
import TABLES from '../database/tables.constant';

@Injectable()
export class MovieRatingModel extends Model {
  static get tableName() {
    return TABLES.MOVIE_RATING;
  }

  static get uniqueColumns() {
    return ['user_id', 'movie_id'];
  }
}
