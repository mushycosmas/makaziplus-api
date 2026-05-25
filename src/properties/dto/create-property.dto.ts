import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class CreatePropertyDto {
  // =========================
  // TITLE
  // =========================
  @IsString()
  @IsNotEmpty()
  title!: string;

  // =========================
  // DESCRIPTION
  // =========================
  @IsString()
  @IsNotEmpty()
  description!: string;

  // =========================
  // PRICE
  // =========================
  @Type(() => Number)
  @IsNumber()
  price!: number;

  // =========================
  // TYPE
  // =========================
  @IsEnum(PropertyType)
  type!: PropertyType;

  // =========================
  // STATUS (optional)
  // =========================
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  // =========================
  // USER ID
  // =========================
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  // =========================
  // CATEGORY ID
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  // =========================
  // WARD ID
  // =========================
  @Type(() => Number)
  @IsNumber()
  wardId!: number;

  // =========================
  // AMENITIES (IMPORTANT FIX)
  // =========================
  @IsOptional()
  amenityIds?: string; // sent from Postman as "[1,2,3]"

  // =========================
  // IMAGES (NOT STORED IN DB DIRECTLY)
  // =========================
  @IsOptional()
  images?: any;
}