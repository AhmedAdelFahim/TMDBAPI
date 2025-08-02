import { Module } from '@nestjs/common';
import configSchema from './config/config-schema';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './caching/redis.module';
import { KnexModule } from './database/knex.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { JobsManagerModule } from './jobs-manager/jobs-manager.module';
import { TmdbIntegrationModule } from './tmdb-integration/tmdb-integration.module';
import { GenresModule } from './genres/genres.module';
import { GenreMoviesModule } from './genre-movies/genre-movies.module';
import { WishlistsModule } from './wishlist/wishlists.module';
import { MovieRatingModule } from './movie-rating/movie-rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    RedisModule,
    KnexModule,
    UsersModule,
    MoviesModule,
    JobsManagerModule,
    TmdbIntegrationModule,
    GenresModule,
    GenreMoviesModule,
    WishlistsModule,
    MovieRatingModule,
  ],
  providers: [],
})
export class AppModule {}
