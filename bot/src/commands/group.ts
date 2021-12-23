import { MessageActionRow, MessageComponentInteraction } from "discord.js";
import Command from "lib/Command";
import { GUILD_ID } from "contants";
import { createGroup, embed, getGroup } from "helpers";

enum Action {
    Create = "create",
    Add = "add",
    Leave = "leave",
    Remove = "remove",
    Info = "info",
    Delete = "delete",
}

export default new Command({
    name: "group",
    description: "command to create and join groups",
    usage: "[create, add, leave, info] <arguments>",
    args: true,
    async execute(client, message, args) {
        const [action, nameOrUser] = args.map(arg => arg.toLowerCase());
        const guild = await client.guilds.fetch(GUILD_ID);

        const author = message.author.id;

        const name = !nameOrUser?.toString().startsWith("<@") ? nameOrUser : null;
        const user = nameOrUser?.startsWith("<@") ? message.mentions.users.first()?.id! : null;

        const { group, channels } = await getGroup({ owner: author, guild });

        switch (action as Action) {
            case Action.Info:
                if (!group) return message.reply("You are not in a group.");
                if (!channels) return message.reply("There was a problem.");

                return message.channel.send({
                    embeds: [
                        embed({
                            author: { name: "Group Info" },
                            fields: [
                                { name: "Name", value: group.name },
                                { name: "Owner", value: message.guild?.members.cache.get(group.owner)?.toString()! },
                                {
                                    name: "Members",
                                    value:
                                        group.members
                                            .map(member => message.guild?.members.cache.get(member)?.toString()!)
                                            .join(", ") || "None",
                                },
                            ],
                        }),
                    ],
                });
            case Action.Create:
                if (!name) return message.reply({ content: "You must provide a name for the group." });

                const {
                    channels: { text },
                } = await createGroup({ name, owner: author, guild });

                return message.reply(`Created group ${text}`);
            case Action.Add:
                if (!user) return message.reply("You must mention a user to add them to the group.");
                if (!group) return message.reply("Create a group first before adding people to it.");
                if (!channels) return message.reply("There was a problem.");

                if (message.author.id != group?.owner) return message.reply("You are not the owner of this group.");
                if (user == author) return message.reply("You can't add yourself to a group.");

                Object.values(channels).map(channel => {
                    channel?.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
                });

                group.members.push(user);
                await group.save();
                return message.reply(`Added ${message.mentions.members?.first()} to the group.`);
            case Action.Remove:
                if (!user) return message.reply("You must mention a user to remove them from the group.");
                if (!group) return message.reply("Create a group first before removing people from it.");
                if (!channels) return message.reply("There was a problem.");

                if (message.author.id != group?.owner) return message.reply("You are not the owner of this group.");
                if (user == author) return message.reply("You can't remove yourself from a group.");

                if (!group.members.includes(user)) return message.reply("That user is not in the group.");

                Object.values(channels).map(channel => {
                    channel?.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
                });

                group.members = group.members.filter(member => member != user);
                await group.save();
                return message.reply(`Removed ${message.mentions.members?.first()} from the group.`);
            case Action.Leave:
                if (!group) return message.reply("You are not in a group.");
                if (!channels) return message.reply("There was a problem.");

                if (author == group.owner) {
                    const row = new MessageActionRow({
                        components: [
                            { customId: "leave-yes", label: "Yes", style: "SUCCESS", type: "BUTTON" },
                            { customId: "leave-no", label: "No", style: "DANGER", type: "BUTTON" },
                        ],
                    });

                    const msg = await message.reply({
                        content: "Are you sure? If you leave the group, it will be deleted. (yes/no)",
                        components: [row],
                    });

                    const filter = ({ customId, user }: MessageComponentInteraction) =>
                        customId.includes("leave") && user.id === author;

                    const collector = message.channel?.createMessageComponentCollector({
                        filter,
                        time: 15000,
                    });

                    collector?.on("collect", async ({ customId }) => {
                        if (customId === "leave-yes") {
                            await channels.text?.delete();
                            await channels.voice?.delete();
                            await channels.category?.delete();

                            await group.delete();
                            await message.reply("Group deleted.");
                            await msg.delete();
                            return collector.stop();
                        } else if (customId === "leave-no") {
                            await message.reply("Cancelled");
                            await msg.delete();
                            return collector.stop();
                        }
                    });
                } else {
                    Object.values(channels).map(channel => {
                        channel?.permissionOverwrites.edit(author, { VIEW_CHANNEL: false });
                    });

                    group.members.filter(member => member != author);
                    await group.save();
                    return message.reply(`Left the group.`);
                }
        }
    },
});
