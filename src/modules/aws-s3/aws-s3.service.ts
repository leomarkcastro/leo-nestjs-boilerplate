import { CONFIG } from '@/config/env';
import { hashString } from '@/utils/functions/hash';
import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private getS3Conection(): S3 {
    const s3Config = {
      accessKeyId: CONFIG.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: CONFIG.AWS_S3_SECRET_ACCESS_KEY,
      region: CONFIG.AWS_S3_REGION,
      params: {
        Bucket: CONFIG.AWS_S3_BUCKET,
      },
      signatureVersion: 'v4',
    };
    if (CONFIG.AWS_S3_ENDPOINT != 'false') {
      s3Config['endpoint'] = CONFIG.AWS_S3_ENDPOINT;
    }
    return new S3(s3Config);
  }

  async viewPresignedImage(fileName: string) {
    try {
      const url = await this.getS3Conection().getSignedUrlPromise('getObject', {
        Bucket: CONFIG.AWS_S3_BUCKET,
        Key: `public/vendor/image/${fileName}`,
      });
      return url;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getS3FileURL(folderLocation: string, fileName: string) {
    const url = `https://${CONFIG.AWS_S3_BUCKET}.s3.${CONFIG.AWS_S3_REGION}.amazonaws.com/${folderLocation}/${fileName}`;
    return url;
  }

  safeURLString(url: string) {
    // replace every non-alphanumeric character with a hyphen
    let urlRet = url.replace(/[^a-zA-Z0-9]/g, '-');
    // replace multiple hyphens with a single hyphen
    urlRet = urlRet.replace(/-+/g, '-');
    return urlRet;
  }

  async generatePresignedUrls(fileNames: string[]) {
    try {
      const s3 = this.getS3Conection();
      const urls = await Promise.all(
        fileNames.map(async (fileName) => {
          const fileType = fileName.split('.').at(-1);
          const origFileName = this.safeURLString(fileName.split('.')[0]);
          const hashedFileName =
            origFileName +
            '-' +
            hashString(origFileName + new Date().getTime()).substring(0, 6) +
            '.' +
            fileType;
          const folderLocation = `public/vendor/image`;
          const uploadUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: CONFIG.AWS_S3_BUCKET,
            Key: `${folderLocation}/${hashedFileName}`,
            Expires: 60 * 5,
          });
          const viewUrl = await this.getS3FileURL(
            folderLocation,
            hashedFileName,
          );

          return {
            originalFileName: fileName,
            uploadFileName: hashedFileName,
            uploadURL: uploadUrl,
            viewURL: viewUrl,
          };
        }),
      );
      return urls;
    } catch (error) {
      Logger.error(error);
    }
  }
}
