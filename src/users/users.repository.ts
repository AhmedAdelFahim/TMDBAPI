import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'objectionjs-repository';
import { UsersModel } from './users.model';
import { IUser } from './users.type';

@Injectable()
export class UsersRepository extends BaseRepository<IUser> {
  constructor(@Inject('KNEX_CONNECTION') knex) {
    super(UsersModel, knex);
  }
}
