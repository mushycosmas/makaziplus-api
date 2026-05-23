import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { PropertyType, PropertyStatus } from '@prisma/client';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  price!: number;

  @IsEnum(PropertyType)
  type!: PropertyType;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsNumber()
  userId!: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsNumber()
  wardId!: number;
}