import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(data: { name: string; regionId: number }) {
    return this.prisma.district.create({
      data,
    });
  }

  // GET ALL
  findAll() {
    return this.prisma.district.findMany({
      include: {
        region: true,
      },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.district.findUnique({
      where: { id },
      include: {
        region: true,
        wards: true,
      },
    });
  }

  // UPDATE
  update(id: number, data: any) {
    return this.prisma.district.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.district.delete({
      where: { id },
    });
  }
}