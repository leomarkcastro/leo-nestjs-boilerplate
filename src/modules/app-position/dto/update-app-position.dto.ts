import { PartialType } from '@nestjs/swagger';
import { CreateAppPositionDto } from './create-app-position.dto';

export class UpdateAppPositionDto extends PartialType(CreateAppPositionDto) {}
