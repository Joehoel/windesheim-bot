import { getModelForClass, prop } from "@typegoose/typegoose";

export class IUser {
  @prop({ required: true })
  id: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  opleiding: string;

  @prop({ required: true })
  studentnummer: string;

  @prop({ required: true })
  nickname: string;

  @prop({ required: true })
  firstname: string;

  @prop({ required: true })
  lastname: string;

  @prop({ required: true })
  docent: boolean;
}

export default getModelForClass(IUser);
