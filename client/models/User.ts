import mongoose, { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  email: string;
  opleiding: string;
  studentnummer: string;
  nickname: string;
  firstname: string;
  lastname: string;
  docent: boolean;
  // verified: boolean;
}

const UserSchema = new Schema<IUser>({
  id: {
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
    required: true,
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
  docent: {
    type: Boolean,
    required: true,
  },
  // verified: {
  //   type: Boolean,
  //   required: true,
  // },
});

export default mongoose.models.User || model<IUser>("User", UserSchema);
