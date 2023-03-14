import { Injectable } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket, Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: true })
export class WebSocketService implements OnGatewayDisconnect, OnGatewayInit {
  private _server: Server;
  private _clients = new Set<Socket>();

  afterInit(server: Server) {
    this._server = server;
  }

  handleDisconnect(client: any) {
    this._clients.delete(client);
  }

  broadcast(event: string, data: any, filter?: (client: Socket) => boolean) {
    if (filter) {
      this._clients.forEach((client) => {
        const result = filter(client);
        if (!result) {
          return;
        }
        client.emit(event, data);
      });
    } else {
      this._server.emit(event, data);
    }
  }

  get server() {
    return this._server;
  }

  get clients() {
    return this._clients;
  }
}
