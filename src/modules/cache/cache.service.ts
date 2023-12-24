import { CONFIG } from '@/config/env';
import { IStringDynamicObject } from '@/global/types/DynamicObjects.types';
import { sha256HashString } from '@/utils/functions/hash';
import { _1_MINUTE } from '@/utils/functions/time';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

const SHORT_CACHE_TIME =
  CONFIG.SHORT_CACHE_TIME == 'false' ? false : Number(CONFIG.SHORT_CACHE_TIME);

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  sortObjectIntoKey(object: IStringDynamicObject) {
    const sortedKeys = Object.keys(object).sort();
    const hashedKeyObject = sortedKeys.reduce((acc, key) => {
      acc += key + ':' + object[key] + '_';
      return acc;
    }, '');

    return sha256HashString(hashedKeyObject);
  }

  async getTTL(key: IStringDynamicObject) {
    const hashedKey = this.sortObjectIntoKey(key);
    return await this.cacheManager.get(`${hashedKey}_ttl`);
  }

  async setTTL(key: IStringDynamicObject, ttl: number) {
    const hashedKey = this.sortObjectIntoKey(key);
    const expiresAt = new Date(Date.now() + ttl);
    return await this.cacheManager.set(`${hashedKey}_ttl`, expiresAt, ttl);
  }

  async get(key: IStringDynamicObject) {
    const hashedKey = this.sortObjectIntoKey(key);
    return await this.cacheManager.get(hashedKey);
  }

  async set(key: IStringDynamicObject, value: any, ttl?: number) {
    const hashedKey = this.sortObjectIntoKey(key);
    if (ttl) {
      await this.setTTL(key, ttl);
    }
    return await this.cacheManager.set(hashedKey, value, ttl);
  }

  async del(key: IStringDynamicObject) {
    const hashedKey = this.sortObjectIntoKey(key);
    if (await this.getTTL(key)) {
      await this.cacheManager.del(`${hashedKey}_ttl`);
    }
    return await this.cacheManager.del(hashedKey);
  }

  async reset() {
    return await this.cacheManager.reset();
  }

  async cachedValueOrFetch<T>(
    key: IStringDynamicObject,
    fetchFunction: () => Promise<T>,
    ttl?: number,
    refreshTime?: number,
    verbose = false,
  ): Promise<T> {
    const cachedValue = await this.get(key);
    if (SHORT_CACHE_TIME) {
      ttl = SHORT_CACHE_TIME;
      refreshTime = Math.ceil(SHORT_CACHE_TIME / 2);
    }
    if (cachedValue) {
      const expiryDate = (await this.getTTL(key)) as Date;

      if (!refreshTime || refreshTime > ttl) {
        refreshTime = Math.ceil(ttl / 2);
      }

      // if expiryDate exists and there's only 1 minute left, refresh the cache
      if (expiryDate && expiryDate.getTime() - Date.now() < refreshTime) {
        // Run in background
        verbose && Logger.verbose('Refreshing cache');
        (async () => {
          await this.setTTL(key, ttl);
          const fetchedValue = await fetchFunction();
          await this.set(key, fetchedValue, ttl);
        })();
      }

      verbose && Logger.verbose('Returning cached value');
      return cachedValue as T;
    }

    verbose && Logger.verbose('Fetching value');
    const fetchedValue = await fetchFunction();
    await this.set(key, fetchedValue, ttl);

    return fetchedValue;
  }

  async secureIdempotence(key: IStringDynamicObject, expireAt = 5 * _1_MINUTE) {
    const cachedValue = await this.get(key);
    if (cachedValue) {
      return false;
    }

    await this.set(key, true, expireAt);
    return true;
  }
}
