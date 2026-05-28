import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyTypesService {
  constructor(private prisma: PrismaService) {}

  // ➕ CREATE TYPE
  create(data: { name: string; icon?: string }) {
    return this.prisma.propertyType.create({
      data,
    });
  }

  // 📦 GET ALL TYPES
  findAll() {
    return this.prisma.propertyType.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });
  }

  // 🔍 GET ONE TYPE
  findOne(id: number) {
    return this.prisma.propertyType.findUnique({
      where: { id },
      include: {
        properties: true,
      },
    });
  }

  // ✏️ UPDATE TYPE
  update(id: number, data: { name?: string; icon?: string }) {
    return this.prisma.propertyType.update({
      where: { id },
      data,
    });
  }

  // ❌ DELETE TYPE
  remove(id: number) {
    return this.prisma.propertyType.delete({
      where: { id },
    });
  }
}