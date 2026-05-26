import { Controller, Post, Delete, Get, Param, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private service: FavoritesService) {}

  // ADD FAVORITE
  @Post(':userId/:propertyId')
  add(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return this.service.addFavorite(Number(userId), Number(propertyId));
  }

  // REMOVE FAVORITE
  @Delete(':userId/:propertyId')
  remove(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return this.service.removeFavorite(Number(userId), Number(propertyId));
  }

  // GET USER FAVORITES
  @Get('user/:userId')
  getUser(@Param('userId') userId: string) {
    return this.service.getUserFavorites(Number(userId));
  }

  // CHECK FAVORITE
  @Get('check')
  check(
    @Query('userId') userId: string,
    @Query('propertyId') propertyId: string,
  ) {
    return this.service.isFavorite(Number(userId), Number(propertyId));
  }
}