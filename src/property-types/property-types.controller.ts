import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';

@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly service: PropertyTypesService) {}

  // ➕ CREATE
  @Post()
  create(@Body() body: { name: string; icon?: string }) {
    return this.service.create(body);
  }

  // 📦 GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔍 GET ONE
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