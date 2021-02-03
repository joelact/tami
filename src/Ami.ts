import { EventEmitter } from 'events';
import AuthOptions from './interfaces/AuthOptions';
import { Connection } from './Connection';
import { Login } from './actions/Login';
import { Ping } from './actions/Ping';
import { parseActionToString, parser } from './Parser';

export class Ami extends EventEmitter {
    public readonly user: string;
    public readonly secret: string;
    public readonly conn: Connection;
    private keepAliveTimeoutRef: NodeJS.Timeout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private functions: Record<string, any[]>;

    constructor(authOpts: AuthOptions, host: string, port?: number) {
        super();
        this.user = authOpts.user;
        this.secret = authOpts.secret;
        this.conn = new Connection(host, port);

        this.functions = {};

        this.conn.on('data', this.handleData.bind(this));
    }

    public connect(): Promise<Connection> {
        return new Promise((resolve) => {
            this.conn.once('connected', resolve);

            this.conn.on('disconnect', () => {
                clearTimeout(this.keepAliveTimeoutRef);
            });

            this.conn.connect();
            this.keepAlive();
            this.sendAuth();
        });
    }

    public action(action: Record<string, string>): Promise<Record<string, string>> {
        return new Promise((resolve, reject) => {
            if (!action.ActionID) {
                action.ActionID = (Math.random() * 1000).toString();
            }

            this.addResponseListener(action.ActionID, (response: Record<string, string>) => {
                resolve(response);
            });

            const parsedAction: string = parseActionToString(action);
            const isWriten: boolean = this.conn.write(parsedAction);

            !isWriten && reject(new Error('action-not-sent'));
        });
    }

    private keepAlive(): void {
        this.keepAliveTimeoutRef = setTimeout(() => {
            const ping: Ping = new Ping();
            this.conn.write(ping.getAction());
            this.keepAlive();
        }, 1000);
    }

    private sendAuth(): void {
        const login: Login = new Login(this.user, this.secret);
        this.conn.write(login.getAction());
    }

    private handleData(data: string): void {
        const response: Record<string, string> = parser(data);

        if (!response.ActionID && !response.Event) {
            return;
        }

        if (response.Event) {
            this.emit('event', response);
            return;
        }

        if (response.ActionID in this.listeners) {
            this.functions[response.ActionID].forEach((func) => {
                func(response);
            });
            delete this.functions[response.ActionID];
        }
    }

    private addResponseListener(actionId: string, callback: (response: Record<string, string>) => void): void {
        if (!this.functions[actionId]) this.functions[actionId] = [];
        this.functions[actionId].push(callback);
    }
}
