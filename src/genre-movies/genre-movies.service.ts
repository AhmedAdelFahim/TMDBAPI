import { Injectable } from '@nestjs/common';
import { GenreMoviesRepository } from './genre-movies.repository';
import { IGenreMovie } from './genre-movies.type';

@Injectable()
export class GenreMoviesService {
  constructor(private readonly genreMoviesRepository: GenreMoviesRepository) {}

  async upsert(items: IGenreMovie[]) {
    await this.genreMoviesRepository.createManyOnConflict(items);
  }
}
