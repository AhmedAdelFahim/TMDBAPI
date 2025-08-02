import { ApiProperty } from '@nestjs/swagger';

export interface IWishlist {
  id?: number;
  movie_id: number;
  user_id: number;
}

export class WishlistFilter {
  @ApiProperty({ example: '1', description: 'page number' })
  page: number;
  @ApiProperty({ example: '10', description: 'number of movies' })
  limit: number;
  @ApiProperty({ example: 'moana', description: 'search query' })
  q: string;
}
