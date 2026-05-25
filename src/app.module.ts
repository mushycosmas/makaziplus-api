import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CategoriesModule } from './categories/categories.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { CountriesModule } from './countries/countries.module';
import { RegionsModule } from './regions/regions.module';
import { DistrictsModule } from './districts/districts.module';
import { WardsModule } from './wards/wards.module';
@Module({
  imports: [
         PrismaModule,
         UsersModule,
         AuthModule,
         PropertiesModule,
         FavoritesModule,
         CategoriesModule,
         AmenitiesModule,
         CountriesModule,
         RegionsModule,
         DistrictsModule,
         WardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
