import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CREATE PROPERTY
  // =========================
  async create(dto: any) {
    const { amenityIds, images, ...propertyData } = dto;

    // FIX: string → array
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
        // AMENITIES (MANY-TO-MANY)
        // =========================
        amenities: parsedAmenityIds?.length
          ? {
              create: parsedAmenityIds.map((amenityId: number) => ({
                amenity: {
                  connect: { id: amenityId },
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
        amenities: {
          include: { amenity: true },
        },
        favorites: true,
      },
    });
  }

  // =========================
  // GET ALL
  // =========================
  findAll() {
    return this.prisma.property.findMany({
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
        amenities: {
          include: { amenity: true },
        },
        favorites: true,
      },
    });
  }

  // =========================
  // UPDATE PROPERTY (FIXED SAFE VERSION)
  // =========================
 async update(id: number, dto: any) {
  const { amenityIds, images, ...propertyData } = dto;

  const parsedAmenityIds =
    typeof amenityIds === 'string'
      ? JSON.parse(amenityIds)
      : amenityIds;

  const files = images || [];

  // 1. Check property exists
  const existing = await this.prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existing) {
    throw new Error('Property not found');
  }

  return this.prisma.$transaction(async (tx) => {
    // =========================
    // UPDATE PROPERTY BASIC DATA
    // =========================
    const updated = await tx.property.update({
      where: { id },
      data: propertyData,
    });

    // =========================
    // DELETE OLD IMAGES (DB)
    // =========================
    await tx.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    // =========================
    // ADD NEW IMAGES
    // =========================
    if (files.length > 0) {
      await tx.propertyImage.createMany({
        data: files.map((file: any) => ({
          url: file.filename,
          propertyId: id,
        })),
      });
    }

    // =========================
    // RESET AMENITIES
    // =========================
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
  // DELETE PROPERTY (CLEAN)
  // =========================
  async remove(id: number) {
    const existing = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.property.delete({
      where: { id },
    });
  }
}