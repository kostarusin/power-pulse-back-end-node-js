import Joi from "joi";

const emailRegexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export const userSignupSchema = Joi.object({
  username: Joi.string().max(20).required().messages({
                    'string.base': `"username" should be a type of 'text'`,
                    'string.empty': `"username" cannot be an empty field`,
                    'string.max': `"username" should have a maximum length of 20`,
                    'any.required': `"username" is a required field.`
                 }),
  email: Joi.string().pattern(emailRegexp).required().messages({
                    'string.base': `"email" must be a string.`,
                    'string.empty': `"email" must not be empty.`,
                    'string.pattern.base': `"email" must be in format example@gmail.com.`,
                    'any.required': `"email" is a required field.`
                 }),
  password: Joi.string().min(6).required().messages({
                    'string.base': `"password" must be a string.`,
                    'string.empty': `"password" must not be empty.`,
                    'string.min': `"username" should have a maximum length of 6`,
                    'any.required': `"password" is a required field.`
                 }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
                    'string.base': `"email" must be a string.`,
                    'string.empty': `"email" must not be empty.`,
                    'string.pattern.base': `"email" must be in format example@gmail.com.`,
                    'any.required': `"email" is a required field.`
                 }),
  password: Joi.string().min(6).required().messages({
                    'string.base': `"password" must be a string.`,
                    'string.empty': `"password" must not be empty.`,
                    'string.min': `"username" should have a maximum length of 6`,
                    'any.required': `"password" is a required field.`
                 }),
});

export const userInfoSchema = Joi.object({
  username: Joi.string().max(20).messages({
                    'string.base': `"username" should be a type of 'text'`,
                    'string.empty': `"username" cannot be an empty field`,
                    'string.max': `"username" should have a maximum length of 20`,
                 }),
  height: Joi.number().min(150).max(300).messages({
                    'number.base': `"height" should be a 'number'`,
                    'number.empty': `"height" cannot be an empty field`,
                    'number.max': `"height" should be maximum 300`,
                    'number.min': `"height" should be minimum 150`,
                 }),
  currentWeight: Joi.number().min(35).max(200).messages({
                    'number.base': `"currentWeight" should be a 'number'`,
                    'number.empty': `"currentWeight" cannot be an empty field`,
                    'number.max': `"currentWeight" should be maximum 200`,
                    'number.min': `"currentWeight" should be minimum 35`,
                 }),
  desiredWeight: Joi.number().min(35).max(200).messages({
                    'number.base': `"desiredWeight" should be a 'number'`,
                    'number.empty': `"desiredWeight" cannot be an empty field`,
                    'number.max': `"desiredWeight" should be maximum 200`,
                    'number.min': `"desiredWeight" should be minimum 35`,
                 }),
  birthday: Joi.date().max(new Date().setFullYear(new Date().getFullYear() - 18))
    .min(new Date().setFullYear(new Date().getFullYear() - 120)).messages({
                    'date.base': `"birthday" should be a type of 'date'`,
                    'date.empty': `"birthday" cannot be an empty field`,
                    'date.max': `"birthday" cannot be older than 18 years`,
                    'date.min': `"birthday" cannot be younger than 120 years`,
                 }),
  blood: Joi.number().valid(1, 2, 3, 4),
  sex: Joi.string().valid("male", "female"),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5),
  avatarURL: Joi.binary(),
});
