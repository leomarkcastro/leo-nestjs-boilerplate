import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateSituationBoardDto {
  @IsString()
  name;

  // check if string follows the rgba format (#RRGGBBAA)
  @IsOptional()
  @IsString()
  @Matches(/^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i, {
    message: 'invalid hex format',
  })
  color = '#ffffffff';

  // check if string follows the rgba format (#RRGGBBAA)
  @IsOptional()
  @IsString()
  @Matches(/^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i, {
    message: 'invalid hex format',
  })
  bgColor = '#00000000';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  index: number;
}

export class UpdateSituationBoardDto extends PartialType(
  CreateSituationBoardDto,
) {}

export class UpdateSituationBoardSort {
  @IsString({
    each: true,
  })
  ids: string[];
}
