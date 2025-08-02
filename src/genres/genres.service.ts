import { Injectable } from '@nestjs/common';
import { GenresRepository } from './genres.repository';
import { IGenre } from './genres.type';

@Injectable()
export class GenresService {
  constructor(private readonly genresRepository: GenresRepository) {}

  async upsert(genres: IGenre[]) {
    await this.genresRepository.createManyOnConflict(genres);
  }

  async getAll(): Promise<IGenre[]> {
    return this.genresRepository.getAll({});
  }
}
