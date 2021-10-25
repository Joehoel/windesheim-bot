import { Guild, HexColorString, MessageEmbed, MessageEmbedOptions, Permissions } from "discord.js";
import { color } from "../../config.json";
import Group from "../models/Group";

const COLOR = color as HexColorString;

export function embed(options: MessageEmbedOptions): MessageEmbed {
    return new MessageEmbed({
        ...options,
        color: COLOR,
        timestamp: Date.now(),
    });
}

export async function getGroup({ guild, owner }: { guild: Guild; owner: string }) {
    const group = await Group.findOne({ owner });

    if (!group) {
        return {
            channels: null,
            group: null,
        };
    }

    const text = await guild.channels.fetch(group.text);
    const voice = await guild.channels.fetch(group.voice);

    return {
        channels: {
            text,
            voice,
        },
        group,
    };
}

export async function createGroup({ name, owner, guild }: { name: string; owner: string; guild: Guild }) {
    const category = await guild.channels.create(name, {
        type: "GUILD_CATEGORY",
        permissionOverwrites: [
            {
                id: owner,
                type: "member",
                allow: ["MANAGE_CHANNELS"],
            },
        ],
    });

    const text = await guild.channels.create(name, {
        type: "GUILD_TEXT",
        parent: category,
        permissionOverwrites: [
            // {
            //     id: guild.roles.everyone,
            //     deny: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "ADD_REACTIONS"],
            //     type: "role",
            // },
            { id: owner, allow: ["MANAGE_CHANNELS"], type: "member" },
        ],
    });

    const voice = await guild.channels.create("general", {
        type: "GUILD_VOICE",
        parent: category,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                type: "role",
                deny: "CONNECT",
            },
            { id: owner, allow: "SPEAK", type: "member" },
        ],
    });
    await Group.create({ name, owner, voice: voice.id, text: text.id });

    return {
        channels: { text, voice },
        name,
        owner,
        category,
    };
}
