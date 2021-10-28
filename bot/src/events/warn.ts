import Event from "../lib/Event";

export default new Event({
    name: "warn",
    async run(client, warning) {
        client.logger.warn(warning);
    },
});
