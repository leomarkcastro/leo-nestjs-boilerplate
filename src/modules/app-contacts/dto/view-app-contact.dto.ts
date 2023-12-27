import { CreateAppContactDto } from './create-app-contact.dto';

export class ViewAppContactDto extends CreateAppContactDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
