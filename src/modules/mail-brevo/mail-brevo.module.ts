import { Module } from '@nestjs/common';
import { TemplatesModule } from '../templates/templates.module';
import { MailBrevoService } from './mail-brevo.service';

@Module({
  imports: [TemplatesModule],
  providers: [MailBrevoService],
  exports: [MailBrevoService],
})
export class MailBrevoModule {}
