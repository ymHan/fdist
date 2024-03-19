import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({nemespace: 'event'})
export class EventGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
