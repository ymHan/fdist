import { Controller, Get } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Get()
  async Hello() {
    return 'Hello World';
  }
}
