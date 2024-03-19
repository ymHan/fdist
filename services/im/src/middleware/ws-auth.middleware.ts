import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export type AuthPayload = {
  userID: string;
};

export type SocketWithAuth = Socket & AuthPayload;

export type SocketIOAuthMiddleware = {
  (client: SocketWithAuth, next: (err?: Error) => void)
};

export const socketIOAuthMiddleware = (
 jwtService: JwtService,
 logger: Logger,
 config: ConfigService,
): SocketIOAuthMiddleware =>
  (socket: SocketWithAuth, next) => {
    const handleSocketConnection = async (socket: SocketWithAuth, next) => {
      const token = socket.handshake.query.token as string;

      try {
        const payload = jwtService.verify(token, {
          secret: config.get<string>('JWT_SECRET'),
        });

        if (!payload?.userID || !payload?.verified) {
          throw new UnauthorizedException();
        }
        socket.userID = payload?.userID;
        next();
      } catch (error) {
        next(error);
      }
    };

    handleSocketConnection(socket, next);
  };

