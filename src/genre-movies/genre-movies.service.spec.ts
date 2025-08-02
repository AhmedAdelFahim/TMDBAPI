import { Test, TestingModule } from '@nestjs/testing';
import { GenreMoviesService } from './genre-movies.service';

describe('GenreMoviesService', () => {
  let service: GenreMoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenreMoviesService],
    }).compile();

    service = module.get<GenreMoviesService>(GenreMoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
