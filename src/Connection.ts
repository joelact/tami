import * as net from 'net';
import { EventEmitter } from 'events';

export class Connection extends EventEmitter {
    public readonly host: string;
    public readonly port: number;
    private socket: net.Socket;
    private buffer: string[];

    constructor(host: string, port?: number) {
        super();
        this.host = host;
        this.port = port || 5038;
        this.buffer = [];
    }

    public connect(): Connection {
        this.socket = net.createConnection(this.port, this.host, () => {
            this.emit('connected', this);
        });

        this.socket.on('close', this.handleClose.bind(this));
        this.socket.on('data', this.handleData.bind(this));
        this.socket.on('error', this.handleError.bind(this));

        return this;
    }

    public disconnect(): void {
        this.socket.removeAllListeners();
        this.socket.destroy();
    }

    public write(action: string): boolean {
        return this.socket.write(action);
    }

    private handleClose(): void {
        this.emit('disconnect');
    }

    private handleData(buffer: Buffer): void {
        const chunk: string[] = buffer.toString().split('\r\n\r\n');
        if (chunk.length === 1) {
            this.buffer.push(chunk[0]);
        } else if (chunk.length === 2) {
            this.emit('data', this.buffer.concat(chunk[0]).join(''));
            this.buffer = [];
        } else {
            chunk.forEach((value: string) => {
                this.emit('data', this.buffer.concat(value).join(''));
                this.buffer = [];
            });
        }
    }

    private handleError(err: Error): void {
        this.emit('error', err);
    }
}
