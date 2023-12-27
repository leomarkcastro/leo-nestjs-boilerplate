import { PartialType } from '@nestjs/swagger';
import { CreateAppContactDto } from './create-app-contact.dto';

export class UpdateAppContactDto extends PartialType(CreateAppContactDto) {}
