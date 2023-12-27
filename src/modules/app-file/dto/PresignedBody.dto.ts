import { IsString } from 'class-validator';

export class PresignedFileUpload_Body {
  @IsString({
    each: true,
  })
  fileNames: string[];
}
