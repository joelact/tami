import AuthOptions from "./interfaces/AuthOptions";
import { Connection } from "./Connection";

export class Ami {
  public readonly user: string;
  public readonly secret: string;
  public readonly conn: Connection;

  constructor(authOpts: AuthOptions, host: string, port?: number) {
    this.user = authOpts.user;
    this.secret = authOpts.secret;
    this.conn = new Connection(host, port);
  }

  connect(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.conn.on("connected", resolve);
      this.conn.on("error", reject);

      this.conn.connect();
    });
  }
}
