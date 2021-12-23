import { Consola } from "consola";
import { Collection } from "discord.js";
import Command from "../lib/Command";
import Event from "../utils/Event";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
        aliases: Collection<string, string>;
        events: Collection<string, Event<any>>;
        logger: Consola;
    }
}
