import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { socketIOAuthMiddleware } from '../middleware/ws-auth.middleware';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  crateIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'), 10);

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/10\.0\.([1-9][1-9]\d)\.([1-9][1-9]\d):${clientPort}/`),
      ],
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const config = this.app.get(ConfigService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server
      .of('user')
      .use(socketIOAuthMiddleware(jwtService, this.logger, config));
    server
      .of('message')
      .use(socketIOAuthMiddleware(jwtService, this.logger, config));
    server
      .of('event')
      .use(socketIOAuthMiddleware(jwtService, this.logger, config));
    server.use(socketIOAuthMiddleware(jwtService, this.logger, config));

    server.adapter();
    return server;
  }
}
