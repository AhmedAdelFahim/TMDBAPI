import { ApiProperty } from '@nestjs/swagger';

export interface IMovieRating {
  id?: number;
  movie_id: number;
  user_id: number;
  rating: number;
}

export class RateMovie {
  @ApiProperty({ example: 21, description: 'movie id to be rated' })
  movie_id: number;
  @ApiProperty({ example: 4, description: 'rate for this movie' })
  rating: number;
}
