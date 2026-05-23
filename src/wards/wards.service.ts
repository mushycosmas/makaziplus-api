import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(data: { name: string; districtId: number }) {
    return this.prisma.ward.create({
      data,
    });
  }

  // GET ALL
  findAll() {
    return this.prisma.ward.findMany({
      include: {
        district: true,
      },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.ward.findUnique({
      where: { id },
      include: {
        district: true,
        properties: true,
      },
    });
  }

  // UPDATE
  update(id: number, data: any) {
    return this.prisma.ward.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.ward.delete({
      where: { id },
    });
  }
}