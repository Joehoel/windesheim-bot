import Command from "../../lib/Command";

export default new Command({
  name: "kick",
  description: "Kick a user",
  args: true,
  usage: "<username> <reason>",
  permissions: ["KICK_MEMBERS"],
  aliases: ["k"],
  async execute(_, message, args) {
    const member = await message.mentions.members!.first()!.kick(args.slice(1)[0]);
    await message.channel.send(`:wave: ${member.displayName} has successfully been kicked.`);
  },
});
