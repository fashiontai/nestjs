import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateRedisCacheDto } from './dto/create-redis-cache.dto';
import { UpdateRedisCacheDto } from './dto/update-redis-cache.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
  }

  cacheSet(key: string, value: string, ttl: number) {
    this.cacheManager.set(key, value, ttl).catch((err) => {
      if (err) throw err;
    });
  }

  async cacheGet(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  create(createRedisCacheDto: CreateRedisCacheDto) {
    return 'This action adds a new redisCache';
  }

  findAll() {
    return `This action returns all redisCache`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redisCache`;
  }

  update(id: number, updateRedisCacheDto: UpdateRedisCacheDto) {
    return `This action updates a #${id} redisCache`;
  }

  remove(id: number) {
    return `This action removes a #${id} redisCache`;
  }
}
