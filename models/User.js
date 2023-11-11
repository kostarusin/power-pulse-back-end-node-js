import { Schema, model } from "mongoose";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatarURL: String,
    token: {
      type: String,
    },
    height: {
      type: Number,
      default: null,
      min: 150,
    },
    currentWeight: {
      type: Number,
      min: 35,
      default: null,
    },
    desiredWeight: {
      type: Number,
      min: 35,
      default: null,
    },
    birthday: {
      type: Date,
      min: 18,
      default: null,
    },
    blood: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: null,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      default: undefined,
    },
    levelActivity: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.post("save", handleSaveError);

UserSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

UserSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", UserSchema);

export default User;
