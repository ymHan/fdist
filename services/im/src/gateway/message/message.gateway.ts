import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ChatService } from '../../chat.service';
import { Server, Socket } from 'socket.io';
import { ChatRepository } from '../../database/repositories/chat.repository';
import { UseGuards } from '@nestjs/common';
import { SocketWithAuth } from '../../utils/variables';

@WebSocketGateway({ namespace: 'message' })
export class MessageGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  handleConnection() {}

  constructor(
    private readonly chatService: ChatService,
    private readonly chatRepository: ChatRepository,
  ) {
    this.chatRepository.subscribe('user-message', async (data: string) => {
      this.chatService.receiveMessage(this.server, JSON.parse(data));
    });

    this.chatRepository.subscribe('user-typing', async (data: string) => {
      this.chatService.typingMessage(this.server, JSON.parse(data));
    });

    this.chatRepository.subscribe('message-status', async (data: string) => {
      this.chatService.updateStatus(this.server, JSON.parse(data));
    });
  }

  @SubscribeMessage('get-messages')
  async getMessages(
    client: SocketWithAuth,
    @MessageBody() data: any,
  ): Promise<any> {
    await this.chatService.connectUserChannels(
      client.userID,
      client,
      data?.contactIDs,
    );
    return await this.chatService.getUserMessages(client.userID, data?.contactIDs);
  }

  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() data: any) {
    await this.chatService.sendMessage(data);
  }

  @SubscribeMessage('user-typing')
  async typing(@MessageBody() data: any) {
    await this.chatService.userTyping(data);
  }

  @SubscribeMessage('message-status')
  async updateMsgStatus(@MessageBody() data: any) {
    await this.chatService.messageStatus(data);
  }
}
