import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageGateway } from './gateway/message/message.gateway';
import { UserGateway } from './gateway/user/user.gateway';
import { RedisProvider } from '../../../libs/common/src';
import { EventGateway } from './gateway/event/event.gateway';
import { ChatRepository } from './database/repositories/chat.repository';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatRepository,
    RedisProvider,
    UserGateway,
    MessageGateway,
    EventGateway,
  ],
  exports: [ChatService, ChatRepository]
})
export class ChatModule {}
