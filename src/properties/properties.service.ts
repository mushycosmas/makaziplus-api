import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // CREATE PROPERTY
  create(dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: dto,
    });
  }

  // GET ALL
  findAll() {
    return this.prisma.property.findMany({
      include: {
        user: true,
        category: true,
        ward: true,
        images: true,
        amenities: true,
      },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        ward: true,
        images: true,
        amenities: true,
      },
    });
  }

  // UPDATE
  update(id: number, dto: any) {
    return this.prisma.property.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}