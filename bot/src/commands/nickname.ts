import Command from "../lib/command";
import fetch from "node-fetch";

export default new Command({
  name: "nickname",
  description: "Change your nickname",
  aliases: ["nick"],
  async execute(client, message, args) {
    const { nickname } = await fetch(`http://localhost:3000/api/nickname/${message.author.id}`).then(res =>
      res.json()
    );
    return message.member?.setNickname(nickname);
  },
});
