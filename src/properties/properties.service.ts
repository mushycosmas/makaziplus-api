import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // DELETE FILE HELPER
  // =========================
  private deleteFile(fileName: string) {
    try {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        fileName,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.log(err.message);
  } else {
    console.log(err);
  }
}
  }

  // =========================
  // CREATE PROPERTY
  // =========================
  async create(dto: any) {
    const { amenityIds, images, ...propertyData } = dto;

    const parsedAmenityIds =
      typeof amenityIds === 'string'
        ? JSON.parse(amenityIds)
        : amenityIds;

    const files = images || [];

    return this.prisma.property.create({
      data: {
        ...propertyData,

        // =========================
        // IMAGES
        // =========================
        images: files.length
          ? {
              create: files.map((file: any) => ({
                url: file.filename,
              })),
            }
          : undefined,

        // =========================
        // AMENITIES
        // =========================
        amenities: parsedAmenityIds?.length
          ? {
              create: parsedAmenityIds.map((id: number) => ({
                amenity: {
                  connect: { id },
                },
              })),
            }
          : undefined,
      },

      include: {
        user: true,
        category: true,
        ward: true,
        images: true,
        amenities: { include: { amenity: true } },
        favorites: true,
      },
    });
  }

  // =========================
  // GET ALL
  // =========================
 async findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await this.prisma.$transaction([
    this.prisma.property.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        category: true,
        ward: true,
        images: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    }),
    this.prisma.property.count(),
  ]);

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}
  // =========================
  // GET ONE
  // =========================
  findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        ward: true,
        images: true,
        amenities: { include: { amenity: true } },
        favorites: true,
      },
    });
  }

  // =========================
  // UPDATE PROPERTY (FULL FIXED)
  // =========================
 async update(id: number, dto: any) {
  const { amenityIds, images, ...rest } = dto;

  const parsedAmenityIds =
    typeof amenityIds === 'string'
      ? JSON.parse(amenityIds)
      : amenityIds;

  const files = images || [];

  // =========================
  // FIX TYPES (IMPORTANT)
  // =========================
  const propertyData = {
    ...rest,
    price: rest.price ? Number(rest.price) : undefined,
    userId: rest.userId ? Number(rest.userId) : undefined,
    wardId: rest.wardId ? Number(rest.wardId) : undefined,
    categoryId: rest.categoryId ? Number(rest.categoryId) : undefined,
  };

  return this.prisma.$transaction(async (tx) => {
    // UPDATE PROPERTY
    await tx.property.update({
      where: { id },
      data: propertyData,
    });

    // DELETE OLD IMAGES
    await tx.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    // ADD NEW IMAGES
    if (files.length > 0) {
      await tx.propertyImage.createMany({
        data: files.map((file: any) => ({
          url: file.filename,
          propertyId: id,
        })),
      });
    }

    // RESET AMENITIES
    await tx.propertyAmenity.deleteMany({
      where: { propertyId: id },
    });

    if (parsedAmenityIds?.length) {
      await tx.propertyAmenity.createMany({
        data: parsedAmenityIds.map((amenityId: number) => ({
          propertyId: id,
          amenityId,
        })),
      });
    }

    return tx.property.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        ward: true,
        images: true,
        amenities: {
          include: { amenity: true },
        },
        favorites: true,
      },
    });
  });
}

  // =========================
  // DELETE PROPERTY (FULL CLEAN)
  // =========================
  async remove(id: number) {
    const existing = await this.prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      throw new NotFoundException('Property not found');
    }

    // DELETE FILES
    for (const img of existing.images) {
      this.deleteFile(img.url);
    }

    // DELETE DB RELATIONS FIRST (IMPORTANT FIX)
    await this.prisma.propertyAmenity.deleteMany({
      where: { propertyId: id },
    });

    await this.prisma.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    await this.prisma.favorite.deleteMany({
      where: { propertyId: id },
    });

    // DELETE PROPERTY
    return this.prisma.property.delete({
      where: { id },
    });
  }
}