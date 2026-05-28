import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  // 👤 GET ALL USERS (WITH PROPERTY COUNT) + PAGINATION
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              properties: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 👤 GET SINGLE USER WITH FULL PROPERTIES
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        properties: {
          include: {
            images: true,
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
            category: true,
            amenities: {
              include: {
                amenity: true,
              },
            },
          },
        },
      },
    });
  }

  // 🏠 GET USER PROPERTIES (PAGINATION)
  async getAgentProperties(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where: {
          userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          images: true,
          ward: {
            include: {
              district: true,
            },
          },
          category: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
      }),
      this.prisma.property.count({
        where: { userId },
      }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 🔁 PROMOTE USER TO AGENT (OPTIONAL FEATURE)
  async makeAgent(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: Role.AGENT,
      },
    });
  }
}