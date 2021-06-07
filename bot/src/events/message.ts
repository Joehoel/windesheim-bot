import { Client, Message } from "discord.js";
import Event from "../lib/Event";
import command from "../handlers/command";

export default new Event({
  name: "message",
  async run(client: Client, message: Message) {
    await command(client, message);
  },
});
