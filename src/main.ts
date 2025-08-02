import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './filters/all-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JobsManagerService } from './jobs-manager/jobs-manager.service';
import { MoviesTypes } from './tmdb-integration/tmdb-integration.type';

async function populateData(jobsManagerService) {
  // sync genres at server start
  await jobsManagerService.addJob(
    'populateGenres',
    {},
    {
      removeOnComplete: true,
      removeOnFail: true,
      delay: 1000 * 180,
    },
  );
  // sync movies at server start
  await jobsManagerService.addJob(
    'populateMovies',
    {
      type: MoviesTypes.NOW_PLAYING,
      page: 1,
    },
    {
      removeOnComplete: true,
      removeOnFail: true,
      delay: 1000 * 180,
    },
  );
  // sync genres every week
  await jobsManagerService.addJob(
    'populateGenres',
    {},
    {
      removeOnComplete: true,
      removeOnFail: true,
      repeat: {
        every: 1000 * 60 * 60 * 24 * 7, // every week
      },
    },
  );
  // sync movies every day
  await jobsManagerService.addJob(
    'populateMovies',
    {
      type: MoviesTypes.NOW_PLAYING,
      page: 1,
    },
    {
      removeOnComplete: true,
      removeOnFail: true,
      repeat: {
        every: 1000 * 60 * 60 * 24, // every day
      },
    },
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());
  const jobsManagerService = app.get<JobsManagerService>(JobsManagerService);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('TMDB Documentation')
    .setDescription('TMDB Documentation')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth({ type: 'http' })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port');
  await app.listen(port);
  await jobsManagerService.emptyQueue();
  await populateData(jobsManagerService);
  Logger.verbose(`app started on port: ${port}`);
}
bootstrap();
