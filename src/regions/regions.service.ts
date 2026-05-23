import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  // CREATE REGION
  create(data: { name: string; countryId: number }) {
    return this.prisma.region.create({
      data,
    });
  }

  // GET ALL REGIONS
  findAll() {
    return this.prisma.region.findMany({
      include: {
        country: true,
      },
    });
  }

  // GET ONE REGION
  findOne(id: number) {
    return this.prisma.region.findUnique({
      where: { id },
      include: {
        country: true,
        districts: true,
      },
    });
  }

  // UPDATE REGION
  update(id: number, data: any) {
    return this.prisma.region.update({
      where: { id },
      data,
    });
  }

  // DELETE REGION
  remove(id: number) {
    return this.prisma.region.delete({
      where: { id },
    });
  }
}