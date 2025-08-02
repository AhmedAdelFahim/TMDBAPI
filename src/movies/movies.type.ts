import { ApiProperty } from '@nestjs/swagger';
import { MoviesTypes } from '../tmdb-integration/tmdb-integration.type';

export interface IMovie {
  id?: number;
  tmdb_movie_id: string;
  title: string;
  overview: string;
  genre_ids?: string[];
  poster_path: string;
  release_date: string;
  original_title: string;
  movie_type: MoviesTypes;
  rate_count?: number;
  rate?: number;
}

export class MovieFilter {
  @ApiProperty({ example: '1', description: 'page number' })
  page: number;
  @ApiProperty({ example: '10', description: 'number of movies' })
  limit: number;
  @ApiProperty({ example: 'moana', description: 'search query' })
  q: string;
  @ApiProperty({ example: ['35'], description: 'genres' })
  genres: string[];
}
