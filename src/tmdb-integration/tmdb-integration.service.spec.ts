import { Test, TestingModule } from '@nestjs/testing';
import { TMDBIntegrationService } from './tmdb-integration.service';

describe('TMDBIntegrationService', () => {
  let service: TMDBIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TMDBIntegrationService],
    }).compile();

    service = module.get<TMDBIntegrationService>(TMDBIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
