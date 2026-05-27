import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // ➕ CREATE
  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  // 📦 GET ALL (WITH PAGINATION)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.service.findAll(Number(page), Number(limit));
  }

  // 📦 GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // ✏️ UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  // ❌ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}