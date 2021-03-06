import Command from "../lib/Command";
import { embed } from "../lib/helpers";

export default new Command({
  name: "ping",
  description: "Pong!",
  async execute(_, message) {
    const reply = embed({
      description: `**Pong!**`,
    });
    return message.channel.send({ embeds: [reply] }).then(m => {
      const ping = m.createdTimestamp - message.createdTimestamp;
      m.edit({
        embeds: [
          embed({
            description: `**Pong!** \`${ping}ms\``,
          }),
        ],
      });
    });
  },
});
