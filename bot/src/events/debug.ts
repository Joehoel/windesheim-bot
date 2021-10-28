import Event from "../lib/Event";

export default new Event({
    name: "debug",
    async run(client, info) {
        client.logger.info(info);
    },
});
