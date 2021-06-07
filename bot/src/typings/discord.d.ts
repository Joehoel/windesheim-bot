import { Consola } from "consola";
import "discord.js";
import Command from "../lib/Command";
import Event from "../utils/Event";

type Content = APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions;
type Options = (MessageOptions & { split?: false }) | MessageAdditions;

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    aliases: Collection<string, string>;
    events: Collection<string, Event>;
    logger: Consola;
  }
  interface Message {
    inlineReply(content: Content, options?: Options): Promise<Message | Message[]>;
    edit(content: Content, options?: Options): Promise<Message>;
  }
}
