import Event from "../lib/Event";

export default new Event({
    name: "debug",
    async run(client, info) {
        if (process.env.NODE_ENV === "debug") {
            client.logger.info(info);
        }
    },
});
