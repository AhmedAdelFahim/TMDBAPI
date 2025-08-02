import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsRepository } from './wishlists.repository';
import { WishlistsController } from './wishlists.controller';

@Module({
  providers: [WishlistsService, WishlistsRepository],
  exports: [WishlistsService, WishlistsRepository],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
