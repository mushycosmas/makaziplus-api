import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  // =========================
  // CREATE PROPERTY
  // =========================
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() dto: CreatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.create({
      ...dto,
      images: files || [],
    });
  }

  // =========================
  // GET ALL
  // =========================
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.service.findAll(Number(page), Number(limit));
  }

  // =========================
  // GET SINGLE
  // =========================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // =========================
  // UPDATE PROPERTY (FIXED)
  // =========================
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(Number(id), {
      ...dto,
      images: files || [],
    });
  }

  // =========================
  // DELETE PROPERTY
  // =========================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}