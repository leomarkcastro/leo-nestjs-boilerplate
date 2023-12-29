import * as dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  SECRET: process.env.SECRET || 'secret',
  CORS_WHITELIST: process.env.CORS_WHITELIST || '*',
  CORS_ALLOWED_HEADERS:
    process.env.CORS_ALLOWED_HEADERS ||
    'Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type,Accept,Authorization',
  CORS_EXPOSED_HEADERS: process.env.CORS_EXPOSED_HEADERS || '*',
  APP_PORT: process.env.APP_PORT || '8000',
  BASE_URL: process.env.BASE_URL || 'http://localhost:8000',
  PAGE_URL: process.env.PAGE_URL || 'http://localhost:3000',
  PAGE_RESET_PASSWORD_URL:
    process.env.PAGE_RESET_PASSWORD_URL || '/reset-password',
  NODE_ENV: process.env.NODE_ENV || 'local',
  SHORT_CACHE_TIME: process.env.SHORT_CACHE_TIME || 'false',
  MAILER_BREVO_API_KEY: process.env.MAILER_BREVO_API_KEY || 'secret',
  MAILER_NAME: process.env.MAILER_NAME || 'mailer',
  MAILER_EMAILADDRESS: process.env.MAILER_EMAILADDRESS || 'mailer@test.com',
  TWOFA_EMAIL_EXPIRY_TIME: process.env.TWOFA_EMAIL_EXPIRY_TIME || '300000',
  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID || 'secret',
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY || 'secret',
  AWS_S3_REGION: process.env.AWS_S3_REGION || 'asia-southeast-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'secret',
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT || 'false',
};
