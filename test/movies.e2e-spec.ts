import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception-filter';
import { Knex } from 'knex';
import TABLES from '../src/database/tables.constant';
import { MoviesTypes } from '../src/tmdb-integration/tmdb-integration.type';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let knexInstance: Knex;
  const movie = {
    title: 'x-men',
    original_title: 'x-men',
    overview: 'x-men overview',
    tmdb_movie_id: '1',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let insertedMovie;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knexInstance = app.get('KNEX_CONNECTION');
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

  it('/movies/list (POST) ', () => {
    return request(app.getHttpServer())
      .post('/movies/list')
      .send({
        page: 1,
      })
      .expect(200);
  });

  afterAll(async () => {
    await knexInstance.table(TABLES.MOVIE_RATING).del();
    await knexInstance.table(TABLES.WISHLIST).del();
    await knexInstance.table(TABLES.GENRE).del();
    await knexInstance.table(TABLES.GENRE_MOVIE).del();
    await knexInstance.table(TABLES.MOVIE).del();
    await knexInstance.destroy();
    await app.close();
  });
});
