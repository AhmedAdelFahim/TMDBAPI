import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import schema from './users-validation.schema';
import { UsersService } from './users.service';
import { IUser, LoginDto, User } from './users.type';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'SignUp for user' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiBody({
    type: User,
    description: 'data for create user',
  })
  @Post('sign-up')
  async create(@Body(new JoiValidationPipe(schema.signup)) body: IUser) {
    await this.usersService.signUp(body);
    return {
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiOperation({ summary: 'login for user' })
  @ApiResponse({ status: 200, description: 'logged in.' })
  @ApiBody({
    type: LoginDto,
    description: 'data for user login',
  })
  @Post('login')
  async login(
    @Body(new JoiValidationPipe(schema.login)) body: LoginDto,
    @Res() res: any,
  ) {
    const result = await this.usersService.signIn(body);
    return res.status(HttpStatus.OK).send({
      data: result,
      message: 'User logged in',
      statusCode: HttpStatus.OK,
    });
  }
}
