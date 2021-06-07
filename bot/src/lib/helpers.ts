import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { color } from "../../config.json";

export function embed(options: MessageEmbedOptions): MessageEmbed {
  return new MessageEmbed({
    ...options,
    color,
    timestamp: Date.now(),
  });
}
