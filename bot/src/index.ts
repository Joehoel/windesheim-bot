import "colors";
import consola from "consola";
import { Client, Collection } from "discord.js";
import "dotenv/config";
import Command from "./lib/Command";
import Event from "./lib/Event";
import { registerCommands, registerEvents } from "./lib/registry";
const { TOKEN } = process.env;

const client = new Client();

client.commands = new Collection<string, Command>();
client.aliases = new Collection<string, string>();
client.events = new Collection<string, Event>();
client.logger = consola;

(async () => {
  try {
    // Register commands and events
    await registerCommands(client, "../commands");
    await registerEvents(client, "../events");

    // Log bot in
    await client.login(TOKEN);

    client.logger.log("Windesheim bot " + "online".green.bold + "!");
  } catch (error) {
    client.logger.error(error);
  }
})();

process.on("unhandledRejection", error => {
  client.logger.error("Unhandled promise rejection:", error);
});
