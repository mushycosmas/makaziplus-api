import { Module } from '@nestjs/common';
import { PropertyImagesController } from './property-images.controller';
import { PropertyImagesService } from './property-images.service';

@Module({
  controllers: [PropertyImagesController],
  providers: [PropertyImagesService]
})
export class PropertyImagesModule {}
