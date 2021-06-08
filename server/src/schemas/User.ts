import mongoose, { Document, model, Schema } from "mongoose";

interface User extends Document {
  discordId: string;
  username: string;
  avatar: string;
  email: string;
  opleiding: string;
  studentnummer?: string;
  nickname: string;
  firstname: string;
  lastname: string;
}

const UserSchema = new Schema<User>({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  opleiding: {
    type: String,
    required: true,
  },
  studentnummer: {
    type: String,
  },
  nickname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

export default model<User>("User", UserSchema);
