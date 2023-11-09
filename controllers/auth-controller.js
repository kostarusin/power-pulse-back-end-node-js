import fs, { constants, access } from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import gravatar from "gravatar";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;

  const avatarURL = gravatar.url(email, {
    s: "250",
    d: "retro",
  });

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, `email ${email} already in use`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    verificationCode,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(
      404,
      "Not found or Reuse of the verification link, try to get another verification email, or use signin form "
    );
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email sent",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email not verify");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const userInfo = await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: userInfo.token,
    user: {
      email: userInfo.email,
      subscription: userInfo.subscription,
      avatarURL: userInfo.avatarURL,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const subscriptionUpdate = async (req, res) => {
  const id = req.user._id;
  const { subscription } = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, {
    subscription,
  });

  res
    .status(200)
    .json({ email: updatedUser.email, subscription: updatedUser.subscription });
};

const avatarUpdate = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "File missing");
  }

  const id = req.user._id;
  const oldAvatarUrl = req.user.avatarURL;

  const { path: oldPath, filename } = req.file;

  const image = await Jimp.read(oldPath);
  image.resize(300, 300);
  await image.writeAsync(oldPath);

  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const newAvatarURL = path.join("public", "avatars", filename);

  const updatedUser = await User.findByIdAndUpdate(id, {
    avatarURL: newAvatarURL,
  });

  res.status(200).json({ avatarURL: updatedUser.avatarURL });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout success",
  });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
  avatarUpdate: ctrlWrapper(avatarUpdate),
};
