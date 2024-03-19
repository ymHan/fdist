import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisProvider {
  public pub: RedisClientType;
  public sub: RedisClientType;

  constructor(config: ConfigService) {
    this.pub = createClient({
      url: config.get('REDIS_URI'),
      password: config.get('REDIS_PASSWORD'),
    });

    this.sub = this.pub.duplicate();

    this.pub.on('error', (error) => {
      console.error('Redis Pub Error:', error.message);
    });

    this.sub.on('error', (error) => {
      console.error('Redis Sub Error:', error.message);
    });

    this.pub.connect();
    this.sub.connect();
  }
}
