import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class IPagination {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  sortBy?: string = 'createdAt';

  @IsString()
  sortDesc?: string = 'true';
}

export class IPaginationResponse<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  data: T[];

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  total: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  page: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
