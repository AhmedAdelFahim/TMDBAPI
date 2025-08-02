import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';

@Injectable()
export class JobsManagerService {
  constructor(
    @InjectQueue('tmdb_population_data')
    private readonly tmdbPopulationQueue: Queue,
  ) {}

  async emptyQueue() {
    await this.tmdbPopulationQueue.obliterate({ force: true });
  }

  async addJob(name: string, data: any = {}, options: JobOptions) {
    await this.tmdbPopulationQueue.add(name, data, options);
  }
}
