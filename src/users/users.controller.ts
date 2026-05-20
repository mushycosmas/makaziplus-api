import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create() {
    return this.usersService.createUser();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}