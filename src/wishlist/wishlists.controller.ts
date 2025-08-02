import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import schema from './wishlists-validation.schema';
import { WishlistFilter } from './wishlists.type';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOperation({ summary: 'List wishlists' })
  @ApiBody({
    type: WishlistFilter,
  })
  @Post('list')
  async list(
    @Req() req: any,
    @Res() res: any,
    @Body(new JoiValidationPipe(schema.list)) body: any,
  ) {
    const wishlist = await this.wishlistsService.filter(body, req.user.id);
    return res.status(HttpStatus.OK).send({
      data: {
        movies: wishlist.results,
        page: {
          total_items: wishlist.total,
          total_pages: Math.ceil(wishlist.total / body.limit),
        },
      },
    });
  }

  @ApiOperation({ summary: 'add To Wishlist' })
  @ApiParam({
    type: 'number',
    name: 'movie_id',
    description: 'movie id to be added in user wishlist',
  })
  @Post(':movie_id')
  async addToWishlist(
    @Param(new JoiValidationPipe(schema.addToWishlist)) params: any,
    @Req() req: any,
  ) {
    await this.wishlistsService.addToWishlist(params.movie_id, req.user.id);
    return {
      data: {
        message: 'Added successfully',
        code: HttpStatus.CREATED,
      },
    };
  }

  @ApiOperation({ summary: 'remove From Wishlist' })
  @ApiParam({
    type: 'number',
    name: 'movie_id',
    description: 'movie id to be added in user wishlist',
  })
  @Delete(':movie_id')
  async removeFromWishlist(
    @Param(new JoiValidationPipe(schema.removeFromWishlist)) params: any,
    @Req() req: any,
  ) {
    await this.wishlistsService.removeFromWishlist(
      params.movie_id,
      req.user.id,
    );
    return {
      data: {
        message: 'Removed successfully',
        code: HttpStatus.OK,
      },
    };
  }
}
