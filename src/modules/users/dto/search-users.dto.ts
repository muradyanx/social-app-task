import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  age?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsOptional()
  limit: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsOptional()
  page: number;
}
