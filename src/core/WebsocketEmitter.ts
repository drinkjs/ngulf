import * as Events from "events";
import * as Ws from "ws";
import { WSS_METADATA } from "./decorator";
import { randomUUID } from "crypto";

export interface WsClient {
  id: string;
  ip: string;
  room: string;
  isAlive: boolean;
  data?: any;
  socket: any;
}

export interface WsMessage {
  event: string;
  data: { [key: string]: any };
}

export const WebsocketEvent = {
  connection: Symbol("connection"),
  disconnect: Symbol("disconnect"),
  message: Symbol("message"),
};

export class WebsocketEmitter extends Events.EventEmitter {
  private server: Ws.Server | undefined;

  private clients: WsClient[] = [];

  listen(options: Ws.ServerOptions) {
    this.server = new Ws.Server(options);
    this.checkAlive();
    this.server.on("connection", (client, req) => {
      const wsClient: WsClient = {
        isAlive: true,
        id: randomUUID(),
        ip: req.socket.remoteAddress || "",
        room: req.headers.origin || randomUUID(),
        socket: client,
      };
      this.clients.push(wsClient);

      this.emit(WebsocketEvent.connection, wsClient);

      client.on("message", (msg) => {
        this.emit(WebsocketEvent.message, wsClient);
        this.onMessage(wsClient, msg.toString());
      });

      client.on("close", () => {
        this.onClose(wsClient);
      });

      client.on("pong", () => {
        this.heartbeat(wsClient);
      });

      client.on("error", (err) => {
        this.onError(wsClient, err);
      });
    });

    const services: any[] = Reflect.getMetadata(WSS_METADATA, WebsocketEmitter);
    if (services) {
      services.forEach(({ key, target }) => {
        if (target[key]) {
          return;
        }
        target[key] = this;
      });
    }
  }

  getClientsByRoom(room: string): WsClient[] {
    return this.clients.filter(
      (client) =>
        client.room === room &&
        client.socket.readyState === Ws.OPEN &&
        client.isAlive
    );
  }

  getClientById(id: string) {
    return this.clients.find((v) => v.id === id);
  }

  /**
   * 消息处理
   * @param {*} target websocket client
   * @param {*} msg {event:"xx", data:{...}}
   */
  onMessage(target: WsClient, msg: string) {
    try {
      const msgObj: WsMessage = JSON.parse(msg);
      this.emit(msgObj.event, { data: msgObj.data, target });
    } catch (e) {
      console.error(e);
    }
  }

  onClose(target: WsClient) {
    target.isAlive = false;
    this.removeClient(target);
    this.emit(WebsocketEvent.disconnect, target);
  }

  onError(target: WsClient, error: Error) {
    this.removeClient(target);
    this.emit(WebsocketEvent.disconnect, target);
    console.error(error);
  }

  heartbeat(target: WsClient) {
    target.isAlive = true;
  }

  removeClient(client: WsClient) {
    if (client) {
      this.clients = this.clients.filter((v) => v && v.id !== client.id);
    }
  }

  // 心跳检测
  checkAlive() {
    setInterval(() => {
      const { clients } = this;
      clients.forEach((client) => {
        if (client.isAlive === false) {
          client.socket.terminate();
          this.onClose(client);
          return;
        }
        client.isAlive = false;
        client.socket.ping();
      });
    }, 5000);
  }
}
