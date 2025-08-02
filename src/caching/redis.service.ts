import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('RedisConnection') private clientRedis: Redis) {}

  async setKey(key: string, value: string, options: { ttl?: number } = {}) {
    await this.clientRedis.set(key, value);
    if (options.ttl) {
      await this.clientRedis.expire(key, options.ttl);
    }
  }

  async getKey(key) {
    return this.clientRedis.get(key);
  }

  hashString(str: string) {
    return createHash('sha256').update(str).digest('base64');
  }
  getKeyForCaching(filter: Record<string, any>, prefix: string = '') {
    const mappedObj = Object.keys(filter)
      .sort()
      .reduce((finalObject, key) => {
        finalObject[key] = filter[key];
        return finalObject;
      }, {});
    const mappedObjStr = JSON.stringify(mappedObj);
    const key = this.hashString(mappedObjStr);
    return `${prefix}:${key}`;
  }
}
