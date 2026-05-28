import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

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
  @Min(0)
  price!: number;

  // =========================
  // PROPERTY TYPE ID
  // =========================
  @Type(() => Number)
  @IsInt()
  typeId!: number;

  // =========================
  // STATUS
  // =========================
  @IsOptional()
  @IsEnum(['AVAILABLE', 'SOLD', 'RENTED'])
  status?: 'AVAILABLE' | 'SOLD' | 'RENTED';

  // =========================
  // USER ID
  // =========================
  @Type(() => Number)
  @IsInt()
  userId!: number;

  // =========================
  // CATEGORY ID
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  // =========================
  // WARD ID
  // =========================
  @Type(() => Number)
  @IsInt()
  wardId!: number;

  // =========================
  // BEDROOMS
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bedrooms?: number;

  // =========================
  // BATHROOMS
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bathrooms?: number;

  // =========================
  // SIZE
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size?: number;

  // =========================
  // YEAR BUILT
  // =========================
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearBuilt?: number;

  // =========================
  // AMENITIES (ARRAY OF IDS - FIXED)
  // =========================
 // Change this:
@IsOptional()
@Transform(({ value }) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value === 'string') return value.split(',').map(Number);
  return [];
})
@IsArray()
@Type(() => Number)
amenities?: number[];  // ← Remove this

// Add this:
@IsOptional()
@Transform(({ value }) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value === 'string') return value.split(',').map(Number);
  return [];
})
@IsArray()
@Type(() => Number)
amenityIds?: number[];  // ← Add this
  // =========================
  // IMAGES
  // =========================
  @IsOptional()
  images?: any[];
}