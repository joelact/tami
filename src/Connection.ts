import * as net from "net";
import { EventEmitter } from "events";

export class Connection extends EventEmitter {
  public readonly host: string;
  public readonly port: number;
  private socket: net.Socket;

  constructor(host: string, port?: number) {
    super();
    this.host = host;
    this.port = port || 5038;
  }

  connect(): Connection {
    this.socket = net.createConnection(this.port, this.host, () => {
      this.emit("connected", this);
    });

    this.socket.on("error", (err: Error) => {
      this.emit("error", err);
    });

    this.socket.setKeepAlive(true, 1000);

    return this;
  }
}
