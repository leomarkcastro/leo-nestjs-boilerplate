import { AppClient, OpenAPIConfig } from '../api';

export function api(opts?: { token?: string }) {
  const BASE = 'http://localhost:8000';

  const config: Partial<OpenAPIConfig> = {
    BASE,
  };

  if (opts?.token) {
    config.TOKEN = opts.token;
  }

  const appClient = new AppClient(config);

  return appClient;
}

export function randomString(min: number, max: number) {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}
