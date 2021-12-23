import { Client, Guild, HexColorString, MessageEmbed, MessageEmbedOptions, Permissions } from "discord.js";
import { color } from "config";
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
            category: null,
        };
    }

    const text = await guild.channels.fetch(group.text);
    const voice = await guild.channels.fetch(group.voice);
    const category = await guild.channels.fetch(group.category);

    return {
        channels: {
            text,
            voice,
            category,
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
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            { id: "850652458678353920", type: "member", allow: [Permissions.FLAGS.VIEW_CHANNEL] },
            { id: guild.roles.everyone, type: "role", deny: [Permissions.FLAGS.VIEW_CHANNEL] },
        ],
    });

    const text = await guild.channels.create(name, {
        type: "GUILD_TEXT",
        parent: category,
        permissionOverwrites: [
            {
                id: owner,
                type: "member",
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            { id: "850652458678353920", type: "member", allow: [Permissions.FLAGS.VIEW_CHANNEL] },
            { id: guild.roles.everyone, type: "role", deny: [Permissions.FLAGS.VIEW_CHANNEL] },
        ],
    });

    const voice = await guild.channels.create("general", {
        type: "GUILD_VOICE",
        parent: category,
        permissionOverwrites: [
            {
                id: owner,
                type: "member",
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            { id: "850652458678353920", type: "member", allow: [Permissions.FLAGS.VIEW_CHANNEL] },
            { id: guild.roles.everyone, type: "role", deny: [Permissions.FLAGS.VIEW_CHANNEL] },
        ],
    });
    await Group.create({ name, owner, voice: voice.id, text: text.id, category: category.id });

    return {
        channels: { text, voice, category },
        name,
        owner,
        category,
    };
}
