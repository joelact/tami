export abstract class Action {
    public readonly actionId: string;

    public constructor() {
        this.actionId = (Math.random() * 100).toString();
    }

    public abstract getAction(): string;
}
