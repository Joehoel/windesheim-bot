import Command from "../../lib/Command";

export default new Command({
  name: "say",
  description: "Outputs message from user",
  args: true,
  usage: "<message>",
  permissions: ["MANAGE_MESSAGES"],
  aliases: ["s"],
  async execute(_, message, args) {
    await message.delete();
    return message.channel.send(args.join(" "));
  },
});
