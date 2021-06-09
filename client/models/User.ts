import mongoose, { Document, model, Schema } from "mongoose";

interface User extends Document {
  email: string;
  opleiding: string;
  studentnummer: string;
  nickname: string;
  firstname: string;
  lastname: string;
  verified: boolean;
}

const UserSchema = new Schema<User>({
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
  verified: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.models.User || model<User>("User", UserSchema);
