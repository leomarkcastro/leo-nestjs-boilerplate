// read .env file, remove all comments, keep all lines as it is
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const envFile = readFileSync(join(__dirname, '..', '..', '..', '.env'));

if (!envFile) {
  throw new Error('No env file found');
}

const envVars = envFile
  .toString()
  .split('\n')
  .filter((line) => {
    if (line.startsWith('#')) {
      return false;
    }
    const [key, value] = line.split('=');
    if (key && value) {
      return true;
    }
    return false;
  })
  .map((line) => {
    if (line.startsWith('#')) {
      return line;
    }
    const [key, value] = line.split('=');
    // remove anything after # in value
    if (value.includes('#')) {
      return `${key}=${value.split('#')[0].trim()}`;
    }
    return `${key}=${value.trim()}`;
  });

const obfuscatedEnvFile = envVars.join('\n');

writeFileSync(
  join(__dirname, '..', '..', '..', '.env.clean'),
  obfuscatedEnvFile,
);
