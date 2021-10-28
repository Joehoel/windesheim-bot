import Event from "../lib/Event";

export default new Event({
    name: "error",
    async run(client, error) {
        client.logger.error(error);
    },
});
