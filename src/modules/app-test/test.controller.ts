import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { MailBrevoService } from '../mail-brevo/mail-brevo.service';
import { MinioService } from '../minio/minio.service';
import { PERMISSIONS } from '../permit/permissions.types';
import { PermitService } from '../permit/permit.service';
import { TemplatesService } from '../templates/templates.service';
import { PresignedFileUpload_Body } from './dto/PresignedBody.dto';
import { PresignedFileUpload_Response } from './dto/PresignedResponse.dto';

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(
    private readonly templates: TemplatesService,
    private readonly minio: MinioService,
    private readonly mail: MailBrevoService,
    private readonly permit: PermitService,
  ) {}

  async onlyDev(user: IUserJwt) {
    await this.permit.checkPermit(
      user,
      {},
      {
        type: 'Permission',
        role: PERMISSIONS.TEST.USE,
      },
    );
  }

  @Auth()
  @Get('template')
  async getTemplate(@CurrentUser() user: IUserJwt) {
    await this.onlyDev(user);
    const template = await this.templates.getTemplate('upload.html', {
      uploadUrl:
        'https://nestjs-template-test.file-asia-se-01-api.db.srv01.xyzapps.xyz/public/vendor/image/string-f652d9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=TJtUZzrRWKXsMlZ0%2F20231224%2Fasia-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231224T070024Z&X-Amz-Expires=300&X-Amz-Signature=841e40b5ae8fb98330d5510f435d0124a0b4de64160a19ba990cab4c3d8a673e&X-Amz-SignedHeaders=host',
    });
    return template;
  }

  @Auth()
  @Post('upload')
  async generatePresignedUrls(
    @CurrentUser() user: IUserJwt,
    @Body() body: PresignedFileUpload_Body,
  ): Promise<PresignedFileUpload_Response[]> {
    await this.onlyDev(user);
    const urls = await this.minio.generatePresignedUploadUrls(body.fileNames);
    return urls;
  }

  @Auth()
  @Get('file')
  async getFile(@CurrentUser() user: IUserJwt, @Res() res: any) {
    await this.onlyDev(user);
    const fileLocation = 'Screenshot-2023-03-20-121624-35d749.png';
    const file = await this.minio.getObject(
      'nestjs-template-test',
      fileLocation,
    );
    res.writeHead(200, {
      'Content-Type': file.mime,
    });
    file.stream.on('data', async function (chunk) {
      res.write(chunk);
    });
    file.stream.on('end', function () {
      res.end();
    });
  }

  @Auth()
  @Get('mail-test')
  async mailTest(@CurrentUser() user: IUserJwt) {
    await this.onlyDev(user);
    await this.mail.sendEmailFromTemplate(
      'leomarkcastro123@gmail.com',
      'Yo!',
      'Yo!',
      'sample.hbs',
      {
        title: 'Testhaha',
        content: 'Test',
      },
    );
  }
}
