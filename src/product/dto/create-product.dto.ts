import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateOrigenDto {
  @IsString()
  @IsNotEmpty()
  pais!: string;

  @IsString()
  @IsNotEmpty()
  estado!: string;
}

class CreateInventarioDto {
  @IsNumber()
  @Min(0)
  stock!: number;

  @IsNumber()
  @Min(1)
  grams!: number;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return plainToInstance(CreateOrigenDto, parsed);
    }

    return value;
  })
  @ValidateNested()
  @Type(() => CreateOrigenDto)
  @IsNotEmpty()
  origin!: CreateOrigenDto;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return plainToInstance(CreateInventarioDto, parsed);
    }

    return value;
  })
  @ValidateNested()
  @Type(() => CreateInventarioDto)
  @IsNotEmpty()
  inventary!: CreateInventarioDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
