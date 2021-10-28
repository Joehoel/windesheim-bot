import Event from "../lib/Event";
import command from "../handlers/command";

export default new Event({
    name: "messageCreate",
    async run(client, message) {
        await command(client, message);
    },
});
