import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresRepository } from './genres.repository';
import { GenresController } from './genres.controller';

@Module({
  providers: [GenresService, GenresRepository],
  exports: [GenresService, GenresRepository],
  controllers: [GenresController],
})
export class GenresModule {}
