import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 'Ahmed', description: 'name of user' })
  name: string;
  @ApiProperty({ example: 'ahmed@gmail.com', description: 'email of user' })
  email: string;
  @ApiProperty({ example: 'P@ssw0rd', description: 'password of user' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'ahmed@gmail.com', description: 'email of user' })
  email: string;
  @ApiProperty({ example: 'P@ssw0rd', description: 'password of user' })
  password: string;
}

export interface IUser {
  id?: number;
  email: string;
  name: string;
  password: string;
}
