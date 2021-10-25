import { Client, VoiceState } from "discord.js";
import Event from "../lib/Event";

export default new Event({
    name: "voiceStateUpdate",
    async run(client: Client, oldState: VoiceState, newState: VoiceState) {
        console.log("Joined VC");
    },
});
