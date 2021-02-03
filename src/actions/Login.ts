import { Action } from './Action';

export class Login extends Action {
    public constructor(private readonly user: string, private readonly secret: string) {
        super();
    }

    public getAction(): string {
        return `Action: Login\r\nActionID: ${this.actionId}\r\nUserName: ${this.user}\r\nSecret: ${this.secret}\r\n\r\n`;
    }
}
