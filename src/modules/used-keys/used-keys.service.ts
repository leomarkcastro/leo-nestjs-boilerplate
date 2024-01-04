import { IStringDynamicObject } from '@/global/types/DynamicObjects.types';
import { _1_HOUR } from '@/utils/functions/time';
import { HttpException, Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UsedKeysService {
  constructor(private readonly cache: CacheService) {}

  intoKey(object: IStringDynamicObject) {
    return this.cache.sortObjectIntoKey(object);
  }

  async exists(
    object: IStringDynamicObject,
    params?: {
      throwOnExists?: boolean;
      throwErrorMsg?: string;
    },
  ) {
    const exists = await this.cache.getTTL(object);

    if (exists && params?.throwOnExists) {
      throw new HttpException(
        params.throwErrorMsg ?? 'Key already exists',
        400,
      );
    }

    return exists;
  }

  async add(object: IStringDynamicObject, ttl: number = 6 * _1_HOUR) {
    await this.cache.setTTL(object, ttl);
  }
}
