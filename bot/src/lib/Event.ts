import { Client, ClientEvents } from "discord.js";

export default class Event<T extends keyof ClientEvents> {
    public name: T;
    public run: (client: Client, ...args: ClientEvents[T]) => Promise<void>;

    constructor({ name, run }: { name: T; run: (client: Client, ...args: ClientEvents[T]) => Promise<void> }) {
        this.name = name;
        this.run = run;
    }
}
