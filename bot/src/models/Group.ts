import { getModelForClass, prop, Severity } from "@typegoose/typegoose";

class Group {
    @prop()
    public name!: string;

    @prop()
    public owner!: string;

    @prop()
    public voice!: string;

    @prop()
    public text!: string;

    @prop()
    public category!: string;

    @prop({ default: true })
    public locked?: boolean;

    @prop({ options: { allowMixed: Severity.ALLOW } })
    public members!: string[];
}

export default getModelForClass(Group);
