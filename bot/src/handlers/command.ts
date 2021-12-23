import { Client, Message } from "discord.js";
import Command from "../lib/Command";
import { prefix } from "../../config.json";

export default async (client: Client, message: Message) => {
    // Not a command or author is bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // Command handler

    // Parse args from message content
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()!.toLowerCase();

    // Check if the message is just the prefix
    if (commandName === prefix) return;

    // Check if command exists
    if (!client.commands.has(commandName) && !client.aliases.has(commandName)) {
        await message.channel.send(`Sorry, ${message.author}! that command doesn't exist`);
        return;
    }

    // Get command from collection
    const command: Command = client.commands.get(commandName)! || client.commands.get(client.aliases.get(commandName)!);

    if (command.channels?.length! > 0 && !command.channels?.includes(message.channel.id)) {
        const msg = await message.channel.send(`Sorry, ${message.author}! You can't use that command here.`);
        await message.delete();
        await msg.delete();
        return;
    }

    // Check if user is admin for command
    if (command.admin && !message.member!.permissions.has("ADMINISTRATOR")) {
        await message.channel.send(`Sorry, ${message.author}! You must be an admin to execute this command.`);
        return;
    }

    // Check if user has the correct roles te execute command
    if (command.roles.some(role => !message.member!.roles.cache.find(_role => _role.id === role))) {
        await message.channel.send(`Sorry, ${message.author}! You are not allowed to execute that command.`);
        return;
    }

    // Check if user has the correct permissions te execute command
    if (command.permissions.some(permission => !message.member!.permissions.has(permission))) {
        await message.channel.send(`Sorry, ${message.author}! You are not allowed to execute that command.`);
        return;
    }

    // Check if user provided argument for the command
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        await message.channel.send(reply);
        return;
    }

    // If all check have passed, execute command
    try {
        return command.execute(client, message, args);
    } catch (error) {
        client.logger.error(error);
        await message.reply("There was an error trying to execute that command!");
    } finally {
        client.logger.info(`${message.author.tag} (${message.author.id}) ran a command: '${command.name}'`);
    }
};
