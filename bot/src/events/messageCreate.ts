import { Client, Message } from "discord.js";
import Event from "../lib/Event";
import command from "../handlers/command";

export default new Event({
    name: "messageCreate",
    async run(client: Client, message: Message) {
        await command(client, message);
    },
});
