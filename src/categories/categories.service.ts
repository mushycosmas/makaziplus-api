import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // 🏷️ CREATE CATEGORY
 async create(data: any) {
  const existing = await this.prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    return {
      success: false,
      message: 'Category already exists',
    };
  }

  return this.prisma.category.create({
    data,
  });
}

  // 📦 GET ALL CATEGORIES (PAGINATION)
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
      }),
      this.prisma.category.count(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 📦 GET SINGLE CATEGORY
  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        properties: {
          include: {
            images: true,
            ward: true,
            category: true,
          },
        },
      },
    });
  }

  // ✏️ UPDATE CATEGORY
  update(id: number, data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // ❌ DELETE CATEGORY
  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}