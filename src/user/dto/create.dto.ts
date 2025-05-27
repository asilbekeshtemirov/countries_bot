import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from '../enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Telegram ID of the user', example: 123456789 })
  @IsNumber()
  @IsNotEmpty()
  telegramId: number;

  @ApiProperty({ description: 'Username of the user', example: 'john_doe', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'First name of the user', example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Phone number of the user', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Role of the user', enum: UserRole, example: UserRole.USER, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

