import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import schema from './movies-validation.schema';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { MovieFilter } from './movies.type';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @ApiOperation({ summary: 'List movies' })
  @ApiBody({
    type: MovieFilter,
    description: 'filter options',
  })
  @Post('list')
  async list(
    @Body(new JoiValidationPipe(schema.list)) body: any,
    @Res() res: any,
  ) {
    const movies = await this.moviesService.filter(body);
    return res.status(HttpStatus.OK).send({
      data: {
        movies: movies.results,
        page: {
          total_items: movies.total,
          total_pages: Math.ceil(movies.total / body.limit),
        },
      },
    });
  }
}
