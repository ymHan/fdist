import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from '../../chat.service';
import { Server } from 'socket.io';
import { ChatRepository } from '../../database/repositories/chat.repository';
import { SocketWithAuth } from '../../utils/variables';

@WebSocketGateway({ namespace: 'user' })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly chatRepository: ChatRepository,
  ) {
    this.chatRepository.subscribe('contact', async (event: string) => {
      this.notificationEvent(JSON.parse(event));
    });
  }

  @SubscribeMessage('online-friends')
  async returnActiveUsers(@MessageBody() data: any): Promise<any> {
    return this.chatService.activeUsers(data?.contactIDs);
  }

  handleConnection(client: SocketWithAuth) {
    this.chatService.addUserOnline(client.userID, client?.id);
  }

  @SubscribeMessage('online')
  async online(client: SocketWithAuth) {
    this.chatService.addUserOnline(client.userID, client?.id);
  }

  handleDisconnect(client: SocketWithAuth) {
    this.chatService.removeUserOnline(client.userID);
  }

  async notificationEvent(event: any) {
    const socketID = await this.chatRepository.get(event?.data?.receiverID);

    if (socketID) await this.server.to(socketID).emit('notify-contact', event);
  }
}
