import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionFilter } from '../src/filters/all-exception-filter';
import { Knex } from 'knex';
import TABLES from '../src/database/tables.constant';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let knexInstance: Knex;
  const user = {
    name: 'ahmed',
    email: 'ahmed@email.com',
    hashedPassword:
      '$2b$10$G1iw3TBisHfrUCbUvyM1lO1nER43UUOHMiBnMEVCK3mm1qFiCnpcW',
    password: 'P@ssw0rd',
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let insertedUser;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    knexInstance = app.get('KNEX_CONNECTION');
    await knexInstance.table(TABLES.WISHLIST).del();
    await knexInstance.table(TABLES.MOVIE_RATING).del();
    await knexInstance.table(TABLES.USER).del();
    insertedUser = (
      await knexInstance
        .table(TABLES.USER)
        .insert({
          name: user.name,
          email: user.email,
          password: user.hashedPassword,
        })
        .returning('*')
    )[0];
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

  it('/users/sign-up (POST) - invalid email', () => {
    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        name: 'ahmed',
        email: 'ahmed3@gmail',
        password: 'P@ssw0rd',
      })
      .expect(400)
      .expect({ errors: [{ message: '"email" must be a valid email' }] });
  });

  it('/users/sign-up (POST) - invalid name', () => {
    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: 'ahmed3@gmail.com',
        password: 'P@ssw0rd',
      })
      .expect(400)
      .expect({ errors: [{ message: '"name" is required' }] });
  });

  it('/users/sign-up (POST) - invalid name', () => {
    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        name: 'ahmed',
        email: 'ahmed3@gmail.com',
        password: 'P@ssword',
      })
      .expect(400)
      .expect({
        errors: [
          {
            message:
              'password must contain number, lower and upper case letters and special chars',
          },
        ],
      });
  });

  it('/users (POST) - sign up with exist email', () => {
    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        name: 'ahmed',
        email: user.email,
        password: 'P@ssw0rd',
      })
      .expect(400)
      .expect({
        errors: [
          {
            fields: ['email'],
            code: 'DATA_ALREADY_EXIST',
            message: 'email already exist',
          },
        ],
      });
  });

  it('/users (POST) - sign up', () => {
    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        name: 'ahmed',
        email: 'ahmed3@gmail.com',
        password: 'P@ssw0rd',
      })
      .expect(201)
      .expect({ message: 'User created successfully', statusCode: 201 });
  });

  it('/users/login (POST) - sign in', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);
  });

  it('/users/login (POST) - sign in - invalid password', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: user.email,
        password: 'invalid password',
      })
      .expect(401)
      .expect({
        errors: [
          {
            message: 'Invalid email or password',
            code: 'INVALID_EMAIL_OR_PASSWORD',
          },
        ],
      });
  });

  afterAll(async () => {
    await knexInstance.table(TABLES.WISHLIST).del();
    await knexInstance.table(TABLES.USER).del();
    await knexInstance.destroy();
    await app.close();
  });
});
