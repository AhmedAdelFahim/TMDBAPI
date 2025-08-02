import { Module } from '@nestjs/common';
import { MovieRatingService } from './movie-rating.service';
import { MovieRatingRepository } from './movie-rating.repository';
import { MovieRatingController } from './movie-rating.controller';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [MovieRatingService, MovieRatingRepository],
  exports: [MovieRatingService, MovieRatingRepository],
  controllers: [MovieRatingController],
})
export class MovieRatingModule {}
