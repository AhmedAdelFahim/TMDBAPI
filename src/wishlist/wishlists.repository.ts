import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, ICreationOptions } from 'objectionjs-repository';
import { WishlistsModel } from './wishlists.model';
import { IWishlist } from './wishlists.type';

@Injectable()
export class WishlistsRepository extends BaseRepository<IWishlist> {
  constructor(@Inject('KNEX_CONNECTION') knex) {
    super(WishlistsModel, knex);
  }

  async createManyOnConflict(
    items: IWishlist[],
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
