import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // ADD TO FAVORITES
  // =========================
  async addFavorite(userId: number, propertyId: number) {
    // check property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // prevent duplicates
    const exists = await this.prisma.favorite.findFirst({
      where: { userId, propertyId },
    });

    if (exists) {
      return { message: 'Already in favorites' };
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  // =========================
  // REMOVE FROM FAVORITES
  // =========================
  async removeFavorite(userId: number, propertyId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, propertyId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }

  // =========================
  // GET USER FAVORITES
  // =========================
  async getUserFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            images: true,
            ward: true,
            category: true,
          },
        },
      },
    });
  }

  // =========================
  // CHECK IF FAVORITED
  // =========================
  async isFavorite(userId: number, propertyId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, propertyId },
    });

    return {
      isFavorite: !!favorite,
    };
  }
}