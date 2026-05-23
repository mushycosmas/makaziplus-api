import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Controller('property-images')
export class PropertyImagesController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('propertyId') propertyId: number,
  ) {
    const images = files.map((file) => ({
      url: file.filename,
      propertyId: Number(propertyId),
    }));

    return this.prisma.propertyImage.createMany({
      data: images,
    });
  }
}