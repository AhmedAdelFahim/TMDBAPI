import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}
  @ApiOperation({ summary: 'List genres' })
  @Get('list')
  async list() {
    const res = await this.genresService.getAll();
    return {
      data: res,
    };
  }
}
