import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function getTemplateFile(fileLocation: string) {
  try {
    // Logger.log(__dirname);
    const fileLoc = join(__dirname, '..', '..', 'templates', fileLocation);
    // Logger.log(fileLoc);
    const data = readFileSync(fileLoc, 'utf8');
    return data;
  } catch (err) {
    Logger.error(err);
    return null;
  }
}
