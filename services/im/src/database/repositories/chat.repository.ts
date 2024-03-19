import { Injectable } from '@nestjs/common';
import { RedisProvider } from "../../../../../libs/common/src";

@Injectable()
export class ChatRepository {
  constructor(private readonly redisProvider: RedisProvider) {}

  subscribe(channel: string, callback: (message: string) => void) {
    this.redisProvider.sub.subscribe(channel, (message, chan) => {
      if (chan === channel) {
        callback(message);
      }
    });
  }

  async publish(channel: string, message: string): Promise<number> {
    return this.redisProvider.pub.publish(channel, message);
  }

  async set(key: string, value: any, ttl?: number) {
    try {
      if (!ttl) {
        await this.redisProvider.pub.set(key, value);
        return;
      }
      await this.redisProvider.pub.set(key, value, { EX: ttl });
    } catch (err: any) {
      console.log(err);
    }
  }

  async get(key: string): Promise<string> {
    try {
      return await this.redisProvider.pub.get(key);
    } catch (err: any) {
      console.log(err);
    }
  }

  async del(key: string)  {
    try {
      await this.redisProvider.pub.del(key);
    } catch (err: any) {
      console.log(err);
    }
  }

  generateRoomIDs(id1: any, id2: any): string {
    return [id1, id2].sort().join('-');
  }

  async jsonGet(key: string, option?: string) {
    try {
      if (!option) {
        option = '$';
      }
      return await this.redisProvider.pub.json.get(key, {
        path: option,
      });
    } catch (err: any) {
      console.log(err);
    }
  }

  async jsonSet(key: string, value: any, option?: string) {
    try {
      if (!option) {
        option = '$';
      }
      await this.redisProvider.pub.json.set(key, option, value);
    } catch (err: any) {
      console.log(err);
    }
  }

  async jsonDel(key: string, option?: string) {
    try {
      if (!option) {
        option = '$';
      }
      await this.redisProvider.pub.json.del(key, option);
    } catch (err: any) {
      console.log(err);
    }
  }

  async jsonArraySetOrAppend(key: string, value: any, option?: string) {
    try {
      if (!option) {
        option = '$';
      }
      const isExist = await this.jsonGet(key, option);
      if (!isExist) {
        await this.redisProvider.pub.json.arrAppend(key, option, value);
      } else {
        await this.jsonSet(key, [value], option);
      }
    } catch (err: any) {
      console.log(err);
    }
  }
}
