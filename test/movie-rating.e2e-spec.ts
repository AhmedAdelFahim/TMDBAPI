import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception-filter';
import { Knex } from 'knex';
import TABLES from '../src/database/tables.constant';
import { MoviesTypes } from '../src/tmdb-integration/tmdb-integration.type';
import { UsersService } from '../src/users/users.service';

describe('MovieRatingController (e2e)', () => {
  let app: INestApplication;
  let knexInstance: Knex;
  const movie = {
    title: 'x-men',
    original_title: 'x-men',
    overview: 'x-men overview',
    tmdb_movie_id: '3',
    movie_type: MoviesTypes.NOW_PLAYING,
    release_date: '2024-01-01',
  };

  const genre = {
    name: 'Action',
    tmdb_genre_id: '1',
    genre_type: 'MOVIE',
  };

  const genreMovie = {
    tmdb_genre_id: genre.tmdb_genre_id,
    tmdb_movie_id: movie.tmdb_movie_id,
  };

  const user1 = {
    name: 'ahmed',
    email: 'ahmed.adel@email.com',
    hashedPassword:
      '$2b$10$G1iw3TBisHfrUCbUvyM1lO1nER43UUOHMiBnMEVCK3mm1qFiCnpcW',
    password: 'P@ssw0rd',
  };

  const user2 = {
    name: 'ahmed',
    email: 'ahmed.adel.fahim@email.com',
    hashedPassword:
      '$2b$10$G1iw3TBisHfrUCbUvyM1lO1nER43UUOHMiBnMEVCK3mm1qFiCnpcW',
    password: 'P@ssw0rd',
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let insertedMovie;
  let insertedUser1;
  let accessToken1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let insertedUser2;
  let accessToken2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knexInstance = app.get('KNEX_CONNECTION');
    const usersService = app.get(UsersService);
    await knexInstance.table(TABLES.MOVIE_RATING).del();
    await knexInstance.table(TABLES.WISHLIST).del();
    await knexInstance.table(TABLES.GENRE).del();
    await knexInstance.table(TABLES.GENRE_MOVIE).del();
    await knexInstance.table(TABLES.MOVIE).del();
    await knexInstance.table(TABLES.GENRE).insert(genre).returning('*');
    insertedMovie = (
      await knexInstance.table(TABLES.MOVIE).insert(movie).returning('*')
    )[0];
    await knexInstance
      .table(TABLES.GENRE_MOVIE)
      .insert(genreMovie)
      .returning('*');

    await knexInstance.table(TABLES.USER).del();
    insertedUser1 = (
      await knexInstance
        .table(TABLES.USER)
        .insert({
          name: user1.name,
          email: user1.email,
          password: user1.hashedPassword,
        })
        .returning('*')
    )[0];
    insertedUser2 = (
      await knexInstance
        .table(TABLES.USER)
        .insert({
          name: user2.name,
          email: user2.email,
          password: user2.hashedPassword,
        })
        .returning('*')
    )[0];
    await knexInstance
      .table(TABLES.WISHLIST)
      .insert({
        user_id: insertedUser1.id,
        movie_id: insertedMovie.id,
      })
      .returning('*');
    accessToken1 = (
      await usersService.signIn({
        email: user1.email,
        password: user1.password,
      })
    ).accessToken;
    accessToken2 = (
      await usersService.signIn({
        email: user2.email,
        password: user2.password,
      })
    ).accessToken;
    await app.init();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionFilter());
    await app.init();
  });

  it('/movie-rating (POST) ', () => {
    return request(app.getHttpServer())
      .post(`/movie-rating/rate-movie`)
      .send({
        movie_id: insertedMovie.id,
        rating: 4,
      })
      .set({ authorization: `Bearer ${accessToken2}` })
      .expect(200)
      .expect({ data: { rate_count: '1', rate: '4.0000000000000000' } });
  });

  it('/wishlists/list (POST) ', () => {
    return request(app.getHttpServer())
      .post(`/wishlists/list`)
      .set({ authorization: `Bearer ${accessToken1}` })
      .expect(200);
  });

  it('/wishlists/{movie_id} (DELETE) ', async () => {
    await request(app.getHttpServer())
      .delete(`/wishlists/${insertedMovie.id}`)
      .set({ authorization: `Bearer ${accessToken2}` })
      .expect(200)
      .expect({ data: { message: 'Removed successfully', code: 200 } });
    return request(app.getHttpServer())
      .post(`/wishlists/${insertedMovie.id}`)
      .set({ authorization: `Bearer ${accessToken2}` })
      .expect(201)
      .expect({ data: { message: 'Added successfully', code: 201 } });
  });

  afterAll(async () => {
    await knexInstance.table(TABLES.MOVIE_RATING).del();
    await knexInstance.table(TABLES.GENRE).del();
    await knexInstance.table(TABLES.WISHLIST).del();
    await knexInstance.table(TABLES.GENRE_MOVIE).del();
    await knexInstance.table(TABLES.MOVIE).del();
    await knexInstance.table(TABLES.USER).del();
    await knexInstance.destroy();
    await app.close();
  });
});
