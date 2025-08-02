import { Module } from '@nestjs/common';
import { TMDBIntegrationConsumer } from './tmdb-integration.consumer';
import { TMDBIntegrationService } from './tmdb-integration.service';
import { JobsManagerModule } from '../jobs-manager/jobs-manager.module';
import { MoviesModule } from '../movies/movies.module';
import { GenresModule } from '../genres/genres.module';
import { GenreMoviesModule } from '../genre-movies/genre-movies.module';

@Module({
  imports: [JobsManagerModule, MoviesModule, GenresModule, GenreMoviesModule],
  providers: [TMDBIntegrationConsumer, TMDBIntegrationService],
})
export class TmdbIntegrationModule {}
