import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateStatusBoardDto {
  @IsString()
  name;

  // check if string follows the rgba format (#RRGGBBAA)
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'invalid hex format',
  })
  color = '#ffffff';

  @IsOptional()
  @IsNumber()
  index = -1;
}

export class UpdateStatusBoardDto extends PartialType(CreateStatusBoardDto) {}

export class UpdateStatusBoardSort {
  @IsString({
    each: true,
  })
  ids: string[];
}
