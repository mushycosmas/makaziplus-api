import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ======================
  // CREATE USER
  // ======================
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // ======================
  // GET ALL USERS
  // ======================
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // ======================
  // GET ONE USER
  // ======================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  // ======================
  // UPDATE USER
  // ======================
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(Number(id), body);
  }

  // ======================
  // DELETE USER
  // ======================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}