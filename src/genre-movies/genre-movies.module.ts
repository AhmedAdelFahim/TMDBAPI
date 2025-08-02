import { Module } from '@nestjs/common';
import { GenreMoviesService } from './genre-movies.service';
import { GenreMoviesRepository } from './genre-movies.repository';

@Module({
  providers: [GenreMoviesService, GenreMoviesRepository],
  exports: [GenreMoviesService, GenreMoviesRepository],
})
export class GenreMoviesModule {}
