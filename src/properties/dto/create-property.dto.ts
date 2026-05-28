import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

import { Type } from 'class-transformer';

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
  // PROPERTY TYPE (NOW ID)
  // =========================
  @Type(() => Number)
  @IsNumber()
  typeId!: number;

  // =========================
  // STATUS (optional)
  // =========================
  @IsOptional()
  status?: string;

  // =========================
  // USER ID
  // =========================
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  // =========================
  // CATEGORY ID (optional)
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
  // AMENITIES (ARRAY OF IDS)
  // =========================
  @IsOptional()
  @IsArray()
  amenityIds?: number[];

  // =========================
  // IMAGES (UPLOAD HANDLED SEPARATELY)
  // =========================
  @IsOptional()
  images?: any[];
}