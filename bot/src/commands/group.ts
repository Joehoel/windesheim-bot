import { GUILD_ID } from "../lib/constants";
import Command from "../lib/Command";
import Group from "../models/Group";
import { createGroup, getGroup } from "../lib/helpers";
import { MessageManager } from "discord.js";

enum Action {
    Create = "create",
    Add = "add",
    Leave = "leave",
}

export default new Command({
    name: "group",
    description: "command to create and join groups",
    async execute(client, message, args) {
        const [action, nameOrUser] = args.map(arg => arg.toLowerCase());
        const guild = await client.guilds.fetch(GUILD_ID);

        const owner = message.author.id;

        const name = !nameOrUser?.toString().startsWith("<@") ? nameOrUser : null;
        const user = nameOrUser?.startsWith("<@") ? message.mentions.users.first()?.id! : null;

        switch (action as Action) {
            case Action.Create:
                if (!name) return message.reply({ content: "You must provide a name for the group." });

                const {
                    channels: { text },
                } = await createGroup({ name, owner, guild });

                return message.reply(`Created group ${text}`);
            case Action.Add:
                if (!user) return message.reply("You must mention a user to add them to the group.");

                const { group, channels } = await getGroup({ owner, guild });

                if (!group) return message.reply("Create a group first before adding people to it.");

                channels?.text?.permissionOverwrites.edit(user, { SEND_MESSAGES: true });

                group.members.push(user);
                await group.save();
        }
    },
});
