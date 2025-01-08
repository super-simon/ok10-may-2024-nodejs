import { model, Schema } from "mongoose";
import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interface";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, reuired: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: {
      enum: RoleEnum,
      type: String,
      required: true,
      default: RoleEnum.USER,
    },
    phone: { type: String, required: false },
    isDeleted: { type: Boolean, required: false },
    isVerified: { type: Boolean, required: false },
  },
  { timestamps: true, versionKey: false },
);

export const User = model<IUser>("users", UserSchema);
