import Joi from "joi";

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userInfoSchema = Joi.object({
  username: Joi.string(),
  height: Joi.number().min(150),
  currentWeight: Joi.number().min(35),
  desiredWeight: Joi.number().min(35),
  birthday: Joi.date().max(
    new Date(new Date() - 18 * 365 * 24 * 60 * 60 * 1000)
  ),
  blood: Joi.number().valid(1, 2, 3, 4),
  sex: Joi.string().valid("male", "female"),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5),
});

export const userCaloriesSchema = Joi.object({
  height: Joi.number().min(150).required(),
  currentWeight: Joi.number().min(35).required(),
  birthday: Joi.date()
    .max(new Date(new Date() - 18 * 365 * 24 * 60 * 60 * 1000))
    .required(),
  sex: Joi.string().valid("male", "female").required(),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
});
