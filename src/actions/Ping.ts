import { Action } from './Action';

export class Ping extends Action {
    public constructor() {
        super();
    }

    public getAction(): string {
        return `Action: Ping\r\nActionID: ${this.actionId}\r\n\r\n`;
    }
}
