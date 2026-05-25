import {
  Body,
  Controller,
  Get,
  Post,
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
      images: files,
    });
  }

  // =========================
  // GET ALL
  // =========================
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // =========================
  // GET SINGLE
  // =========================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // =========================
  // UPDATE
  // =========================
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(Number(id), dto);
  }

  // =========================
  // DELETE
  // =========================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}