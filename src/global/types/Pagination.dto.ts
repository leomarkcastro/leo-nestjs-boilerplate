import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class IPagination {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNumber()
  page?: number = 1;

  @IsNumber()
  limit?: number = 10;

  @IsString()
  sortBy?: string = 'createdAt';

  @IsBoolean()
  sortDesc?: boolean = true;
}

export class IPaginationResponse<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  data: T[];

  @IsNumber()
  @ApiProperty({ type: Number })
  total: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  page: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
