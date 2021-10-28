import { Client, VoiceState } from "discord.js";
import Event from "../lib/Event";

export default new Event({
    name: "voiceStateUpdate",
    async run(client, oldState, newState) {
        console.log("Joined VC");
    },
});
