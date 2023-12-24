import { CONFIG } from '@/config/env';
import { hashString } from '@/utils/functions/hash';
import { Injectable, Logger } from '@nestjs/common';
import { lookup } from 'mime-types';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private getClient() {
    return new Client({
      endPoint: CONFIG.AWS_S3_ENDPOINT,
      region: CONFIG.AWS_S3_REGION,
      accessKey: CONFIG.AWS_S3_ACCESS_KEY_ID,
      secretKey: CONFIG.AWS_S3_SECRET_ACCESS_KEY,
    });
  }

  safeURLString(url: string) {
    // replace every non-alphanumeric character with a hyphen
    let urlRet = url.replace(/[^a-zA-Z0-9]/g, '-');
    // replace multiple hyphens with a single hyphen
    urlRet = urlRet.replace(/-+/g, '-');
    return urlRet;
  }

  async generatePresignedUploadUrls(fileNames: string[]) {
    try {
      const s3 = this.getClient();
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
          const uploadUrl = await s3.presignedPutObject(
            CONFIG.AWS_S3_BUCKET,
            hashedFileName,
            60 * 5,
          );

          const viewUrl = uploadUrl.split('?')[0];

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

  async listFiles() {
    const s3 = this.getClient();
    const data = [];
    const stream = s3.listObjects('test-12242023', '', true);
    stream.on('data', function (obj) {
      data.push(obj);
    });
    stream.on('end', function () {
      Logger.log(data);
    });
    stream.on('error', function (err) {
      Logger.log(err);
    });
  }

  async getObject(bucketName: string, fileName: string) {
    const s3 = this.getClient();
    const obj = await s3.getObject(bucketName, fileName);
    return {
      stream: obj,
      mime: lookup(fileName),
    };
  }
}
