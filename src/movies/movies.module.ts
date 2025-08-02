import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { GenreMoviesModule } from '../genre-movies/genre-movies.module';

@Module({
  imports: [GenreMoviesModule],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService, MoviesRepository],
  controllers: [MoviesController],
})
export class MoviesModule {}
