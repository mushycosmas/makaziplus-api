import { Injectable, NotFoundException } from '@nestjs/common';
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
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // =========================
  // CREATE PROPERTY (FIXED)
  // =========================
  async create(dto: any) {

    const { amenityIds, images, ...propertyData } = dto;

    // =========================
    // PARSE AMENITIES
    // =========================
    const parsedAmenityIds: number[] = (Array.isArray(amenityIds)
      ? amenityIds
      : typeof amenityIds === 'string'
        ? amenityIds.split(',')
        : []
    )
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v > 0);

    const files = Array.isArray(images) ? images : [];

    // =========================
    // CREATE PROPERTY
    // =========================
    const property = await this.prisma.property.create({
      data: {
        ...propertyData,

        price: Number(propertyData.price),
        userId: Number(propertyData.userId),
        wardId: Number(propertyData.wardId),
        categoryId: propertyData.categoryId
          ? Number(propertyData.categoryId)
          : undefined,
        typeId: propertyData.typeId
          ? Number(propertyData.typeId)
          : undefined,

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
      },
    });

    // =========================
    // INSERT AMENITIES (FIXED)
    // =========================
    if (parsedAmenityIds.length) {
      await this.prisma.propertyAmenity.createMany({
        data: parsedAmenityIds.map((amenityId) => ({
          propertyId: property.id,
          amenityId,
        })),
      });
    }

    // =========================
    // RETURN FULL DATA
    // =========================
    return this.prisma.property.findUnique({
      where: { id: property.id },
      include: {
        user: true,
        category: true,

        ward: {
          include: {
            district: {
              include: {
                region: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },

        images: true,

        amenities: {
          include: {
            amenity: true,
          },
        },

        favorites: true,
      },
    });
  }

  // =========================
  // GET ALL
  // =========================
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },

        include: {
          user: true,
          category: true,

          ward: {
            include: {
              district: {
                include: {
                  region: {
                    include: {
                      country: true,
                    },
                  },
                },
              },
            },
          },

          images: true,

          amenities: {
            include: { amenity: true },
          },

          _count: {
            select: { favorites: true },
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

        ward: {
          include: {
            district: {
              include: {
                region: {
                  include: {
                    country: true,
                  },
                },
              },
            },
          },
        },

        images: true,

        amenities: {
          include: { amenity: true },
        },

        favorites: true,
      },
    });
  }

  // =========================
  // UPDATE PROPERTY (FIXED)
  // =========================
  async update(id: number, dto: any) {
    const { amenityIds, images, ...rest } = dto;

    const parsedAmenityIds: number[] = (Array.isArray(amenityIds)
      ? amenityIds
      : typeof amenityIds === 'string'
        ? amenityIds.split(',')
        : []
    )
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v > 0);

    const files = Array.isArray(images) ? images : [];

    const propertyData = {
      ...rest,
      price: rest.price ? Number(rest.price) : undefined,
      userId: rest.userId ? Number(rest.userId) : undefined,
      wardId: rest.wardId ? Number(rest.wardId) : undefined,
      categoryId: rest.categoryId ? Number(rest.categoryId) : undefined,
      typeId: rest.typeId ? Number(rest.typeId) : undefined,
    };

    return this.prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id },
        data: propertyData,
      });

      await tx.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      if (files.length) {
        await tx.propertyImage.createMany({
          data: files.map((file: any) => ({
            url: file.filename,
            propertyId: id,
          })),
        });
      }

      await tx.propertyAmenity.deleteMany({
        where: { propertyId: id },
      });

      if (parsedAmenityIds.length) {
        await tx.propertyAmenity.createMany({
          data: parsedAmenityIds.map((amenityId) => ({
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

          ward: {
            include: {
              district: {
                include: {
                  region: {
                    include: {
                      country: true,
                    },
                  },
                },
              },
            },
          },

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
  // DELETE PROPERTY
  // =========================
  async remove(id: number) {
    const existing = await this.prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      throw new NotFoundException('Property not found');
    }

    for (const img of existing.images) {
      this.deleteFile(img.url);
    }

    await this.prisma.propertyAmenity.deleteMany({
      where: { propertyId: id },
    });

    await this.prisma.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    await this.prisma.favorite.deleteMany({
      where: { propertyId: id },
    });

    return this.prisma.property.delete({
      where: { id },
    });
  }
}