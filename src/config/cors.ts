import { BadRequestException } from '@nestjs/common';
import { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { CONFIG } from './env';

const whitelist: string[] = CONFIG.CORS_WHITELIST
  ? CONFIG.CORS_WHITELIST.split(',')
  : [];
const allowedHeaders: string[] = CONFIG.CORS_ALLOWED_HEADERS
  ? CONFIG.CORS_ALLOWED_HEADERS.split(',')
  : [];

const exposedHeaders: string[] = CONFIG.CORS_EXPOSED_HEADERS
  ? CONFIG.CORS_EXPOSED_HEADERS.split(',')
  : [];

const origin = (
  requestOrigin: string | undefined,
  callback: (error: Error | null, origin?: boolean) => void,
) => {
  if (whitelist.indexOf('*') !== -1) {
    return callback(null, true);
  }

  if (whitelist.indexOf(requestOrigin) !== -1 || !requestOrigin) {
    return callback(null, true);
  }

  return callback(new BadRequestException('Not allowed by CORS'));
};

export default {
  origin,
  exposedHeaders,
  allowedHeaders,
} as unknown as CorsOptionsDelegate<any>;
