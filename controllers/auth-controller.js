import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_SECRET
});

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `email ${email} already in use`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword, createdAt: new Date() });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const userInfo = await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token: userInfo.token,
    user: { email: userInfo.email, username },
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
    message: "You have successfully signed in",
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
    bmr,
    levelActivity,
    createdAt,
    dailyExerciseTime,
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
    bmr,
    levelActivity,
    createdAt,
    dailyExerciseTime,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout success",
  });
};

const updateUserInfo = async (req, res, next) => {
  const {
    username,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
    avatarURL,
  } = req.body;

  const updatedData = {
    height: height || req.user.height,
    currentWeight: currentWeight || req.user.currentWeight,
    desiredWeight: desiredWeight || req.user.desiredWeight,
    birthday: birthday || req.user.birthday,
    blood: blood || req.user.blood,
    sex: sex || req.user.sex,
    levelActivity: levelActivity || req.user.levelActivity,
  };
  const { _id } = req.user;

  let uploadedAvatarURL = null;

  if (req.file) {
    const { path: temporaryName, originalname } = req.file;

    try {
      const existingUser = await User.findById(_id);
      if (existingUser.avatarURL) {
        const publicId = existingUser.avatarURL.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      }
      const result = await cloudinary.uploader.upload(temporaryName, {
        folder: 'avatars',
      });

      uploadedAvatarURL = result.secure_url;
    } catch (err) {
      return next(err);
    }
  }

  const finalAvatarURL = avatarURL || uploadedAvatarURL || req.user.avatarURL;

  const isMale = updatedData.sex.toLowerCase() === "male";
  const activityCoefficient = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  }[updatedData.levelActivity];

  const age = new Date().getFullYear() - new Date(updatedData.birthday).getFullYear();

  const bmrCalc = isMale
    ? (10 * updatedData.currentWeight + 6.25 * updatedData.height - 5 * age + 5) * activityCoefficient
    : (10 * updatedData.currentWeight + 6.25 * updatedData.height - 5 * age - 161) *
      activityCoefficient;

  await User.findByIdAndUpdate(_id, {bmr: bmrCalc, dailyExerciseTime: 110});

  const result = {
    bmr: bmrCalc,
    dailyExerciseTime: 110,
  };
const updatedUserData = {
    username,
    height,
    currentWeight,
    desiredWeight,
    birthday,
    blood,
    sex,
    levelActivity,
    avatarURL: finalAvatarURL,
  };
  await User.findByIdAndUpdate(_id, updatedUserData);

  const responsePayload = {
    ...updatedUserData,
    ...result
  };
  
  res.status(200).json(responsePayload);
};


const calculateCalories = async (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .json({ error: "User data is missing in the request." });
  }
  const { _id, height, currentWeight, birthday, sex, levelActivity, bmr } = req.user;

  if (!height || !currentWeight || !birthday || !sex || !levelActivity) {
    return res
      .status(400)
      .json({ error: "One or more required user properties are missing." });
  }

  const isMale = sex.toLowerCase() === "male";
  const activityCoefficient = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  }[levelActivity];

  const age = new Date().getFullYear() - new Date(birthday).getFullYear();

  const bmrCalc = isMale
    ? (10 * currentWeight + 6.25 * height - 5 * age + 5) * activityCoefficient
    : (10 * currentWeight + 6.25 * height - 5 * age - 161) *
      activityCoefficient;

  await User.findByIdAndUpdate(_id, {bmr: bmrCalc});

  const dailyExerciseTime = 110;
  const result = {
    bmr,
    dailyExerciseTime,
  };
  res.status(201).json(result);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateUserInfo: ctrlWrapper(updateUserInfo),
  calculateCalories: ctrlWrapper(calculateCalories),
};
