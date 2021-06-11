import { Client } from "discord.js";
import Event from "../lib/Event";

export default new Event({
  name: "error",
  async run(client: Client, error: Error) {
    client.logger.error(error);
  },
});
