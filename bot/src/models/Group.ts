import { getModelForClass, prop } from "@typegoose/typegoose";

class Group {
    @prop()
    public name: string;

    @prop()
    public owner: string;

    @prop()
    public voice: string;

    @prop()
    public text: string;

    @prop({ default: true })
    public locked?: boolean;

    @prop()
    public members: string[];
}

export default getModelForClass(Group);
