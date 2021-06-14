import { Client, Message, PermissionString } from "discord.js";

export default class Command {
  public name: string;
  public admin: boolean;
  public usage?: string;
  public args: boolean;
  public description: string;
  public permissions: PermissionString[];
  public aliases: string[];
  public roles: string[];
  public channels?: string[];
  public execute: (client: Client, message: Message, args: string[]) => void;

  constructor({
    name,
    admin,
    usage,
    args,
    description,
    execute,
    permissions,
    aliases,
    roles,
    channels,
  }: {
    name: string;
    admin?: boolean;
    usage?: string;
    args?: boolean;
    description: string;
    permissions?: PermissionString[];
    aliases?: string[];
    roles?: string[];
    channels?: string[];
    execute: (client: Client, message: Message, args: string[]) => void;
  }) {
    this.name = name;
    this.admin = admin ?? false;
    this.usage = usage;
    this.args = args ?? false;
    this.description = description;
    this.execute = execute;
    this.permissions = permissions ?? [];
    this.aliases = aliases ?? [];
    this.roles = roles ?? [];
    this.channels = channels ?? [];
  }
}
