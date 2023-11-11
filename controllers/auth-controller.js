import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import User from "../models/User.js";
import jimp from "jimp";
import fs from "fs/promises";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `email ${email} already in use`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const userInfo = await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token: userInfo.token,
    user: { email: userInfo.email },
    message: "You have successfully signed up",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const userInfo = await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: userInfo.token,
    user: { email: userInfo.email },
  });
};

const getCurrent = async (req, res) => {
  const {
    email,
    username,
    avatarURL,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  } = req.user;
  res.json({
    username,
    email,
    avatarURL,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout success",
  });
};
const updateBasicInfo = async (req, res) => {
  const { _id } = req.user;
  const { path: temporaryName, originalname } = req.file;
  const storeDir = path.join(process.cwd(), "public", "avatars");
  const fileName = `${Date.now()}_${originalname}`;
  const avatarURL = path.join(storeDir, fileName);
  const image = await jimp.read(temporaryName);
  await image.resize(250, 250);
  await image.writeAsync(temporaryName);

  try {
    await fs.rename(temporaryName, avatarURL);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

const enterDetails = async (req, res) => {
  const {
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  } = req.body;
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, {
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
  });

  const isMale = sex.toLowerCase() === "male";
  const activityCoefficient = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  }[levelActivity];

  const age = new Date().getFullYear() - new Date(birthday).getFullYear();

  const bmr = isMale
    ? (10 * currentWeight + 6.25 * height - 5 * age + 5) * activityCoefficient
    : (10 * currentWeight + 6.25 * height - 5 * age - 161) *
      activityCoefficient;

  const dailyExerciseTime = 110;
  const result = {
    bmr,
    dailyExerciseTime,
  };
  res.json(result);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  enterDetails: ctrlWrapper(enterDetails),
  updateBasicInfo: ctrlWrapper(updateBasicInfo),
};
