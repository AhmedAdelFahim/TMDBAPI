import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MovieRatingService } from './movie-rating.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import schema from './movie-rating-validation.schema';
import { RateMovie } from './movie-rating.type';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('movie-rating')
export class MovieRatingController {
  constructor(private readonly movieRatingService: MovieRatingService) {}

  @ApiOperation({ summary: 'List movie Rating' })
  @ApiBody({
    type: RateMovie,
  })
  @Post('rate-movie')
  async rateMovie(
    @Req() req: any,
    @Res() res: any,
    @Body(new JoiValidationPipe(schema.rateMovie)) body: RateMovie,
  ) {
    const result = await this.movieRatingService.rateMovie(
      body.movie_id,
      req.user.id,
      body.rating,
    );
    return res.status(HttpStatus.OK).send({
      data: result,
    });
  }
}
