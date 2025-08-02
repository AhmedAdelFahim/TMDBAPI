import { Injectable } from '@nestjs/common';
import { Model } from 'objection';
import TABLES from '../database/tables.constant';

@Injectable()
export class WishlistsModel extends Model {
  static get tableName() {
    return TABLES.WISHLIST;
  }
}
