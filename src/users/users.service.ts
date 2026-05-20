import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser() {
    return this.prisma.user.create({
      data: {
        fullName: 'Kelvin',
        email: 'kelvin@gmail.com',
        password: '123456',
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}