import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TMDBIntegrationService } from './tmdb-integration.service';

@Processor('tmdb_population_data')
export class TMDBIntegrationConsumer {
  constructor(
    private readonly tmdbIntegrationService: TMDBIntegrationService,
  ) {}
  @Process('populateMovies')
  async populateMovies(job: Job) {
    await this.tmdbIntegrationService.getMovies(job.data);
  }

  @Process('populateGenres')
  async populateGenres() {
    await this.tmdbIntegrationService.populateGenres();
  }
}
