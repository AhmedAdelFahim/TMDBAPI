import { Injectable } from '@nestjs/common';
import R from 'ramda';
import { UsersRepository } from './users.repository';
import bcrypt from 'bcrypt';
import { IUser, LoginDto } from './users.type';
import { UnauthorizedException } from 'unified-errors-handler';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ERROR_CODE_LIST from '../filters/error-codes';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(userData: IUser) {
    userData.password = await this.hashPassword(userData.password);
    await this.usersRepository.create(userData);
  }

  async signIn(loginData: LoginDto) {
    const user = await this.usersRepository.getOne({ email: loginData.email });
    if (R.isNil(user)) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        code: ERROR_CODE_LIST.INVALID_EMAIL_OR_PASSWORD,
      });
    }
    const isValidPassword = await this.checkPassword(
      loginData.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        code: ERROR_CODE_LIST.INVALID_EMAIL_OR_PASSWORD,
      });
    }
    delete user.password;
    return {
      accessToken: await this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        {
          secret: this.configService.get('app.tokenSecret'),
        },
      ),
    };
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async checkPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
