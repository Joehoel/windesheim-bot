import Command from "../lib/command";
import fetch from "node-fetch";

export default new Command({
  name: "nickname",
  description: "Change your nickname",
  aliases: ["nick"],
  usage: "<user>",
  async execute(_, message) {
    const target = message.mentions.members?.first()?.id || message.author.id;
    const { nickname } = await fetch(`http://localhost:3000/api/user/${target}`).then(res => res.json());
    return await message.member?.setNickname(nickname);
  },
});
