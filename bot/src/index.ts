import "dotenv/config";
import consola from "consola";
import { Client, Collection, Intents } from "discord.js";
import Command from "./lib/Command";
import Event from "./lib/Event";
import { registerCommands, registerEvents } from "./lib/registry";
import { mongoose } from "@typegoose/typegoose";
const { TOKEN, MONGO_URI } = process.env;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.commands = new Collection<string, Command>();
client.aliases = new Collection<string, string>();
client.events = new Collection<string, Event<any>>();
client.logger = consola;

(async () => {
    try {
        // Register commands and events
        await registerCommands(client, "../commands");
        await registerEvents(client, "../events");

        await mongoose.connect(MONGO_URI);

        // Log bot in
        await client.login(TOKEN);

        client.logger.log("Windesheim bot " + "online" + "!");
    } catch (error) {
        client.logger.error(error);
    }
})();

process.on("unhandledRejection", error => {
    client.logger.error("Unhandled promise rejection:", error);
});
