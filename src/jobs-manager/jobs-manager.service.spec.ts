import { Test, TestingModule } from '@nestjs/testing';
import { JobsManagerService } from './jobs-manager.service';

describe('JobsManagerService', () => {
  let service: JobsManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsManagerService],
    }).compile();

    service = module.get<JobsManagerService>(JobsManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
