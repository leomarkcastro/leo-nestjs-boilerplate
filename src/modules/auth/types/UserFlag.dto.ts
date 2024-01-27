import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserFlag {
  @IsString()
  name: string;

  @IsString()
  data: string;
}

export class PartialUserFlag extends PartialType(UserFlag) {}
