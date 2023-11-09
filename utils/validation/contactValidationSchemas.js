import Joi from "joi";

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" required field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" required field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" required field`,
  }),
  favorite: Joi.boolean(),
  listType: Joi.string().valid("private", "corporate").required(),
});

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `missing field favorite`,
  }),
});
