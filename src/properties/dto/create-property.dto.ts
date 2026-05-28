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
  @IsOptional()
@Transform(({ value }) => {
  if (!value) return [];

  let arr: any[] = [];

  // if already array
  if (Array.isArray(value)) {
    arr = value;
  }

  // if string (very common in multipart/form-data)
  else if (typeof value === 'string') {
    try {
      // try JSON first: "[11,12]"
      arr = JSON.parse(value);
    } catch {
      // fallback: "11,12"
      arr = value.split(',');
    }
  }

  return arr
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v) && v > 0);
})
@IsArray()
amenityIds?: number[];

  // =========================
  // IMAGES
  // =========================
  @IsOptional()
  images?: any[];
}