import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CREATE USER
  // =========================
  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // =========================
  // GET ALL USERS
  // =========================
  async findAll() {
    return this.prisma.user.findMany();
  }

  // =========================
  // GET SINGLE USER
  // =========================
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // =========================
  // UPDATE USER
  // =========================
  async updateUser(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // =========================
  // DELETE USER
  // =========================
  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}