import { SetMetadata } from '@nestjs/common';

export const PERMIT_KEY = 'permit';

export const SimplePermit = (permit: string) => SetMetadata(PERMIT_KEY, permit);
