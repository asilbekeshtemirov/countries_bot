import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Uzbekistan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'UZ' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 36000000 })
  @IsOptional()
  @IsNumber()
  population?: number;

  @ApiPropertyOptional({ example: 448978 })
  @IsOptional()
  @IsNumber()
  area?: number;
}
