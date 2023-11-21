import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-\d{4}$/;

const DoneExerciseSchema = new Schema(
  {
    exercise: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "exercise",
        required: true,
      },
      bodyPart: {
        type: String,
        required: true,
      },
      equipment: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      target: {
        type: String,
        required: true,
      },
    },
    time: {
      type: Number,
      min: 1,
      required: true,
    },
    calories: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  { versionKey: false }
);

const ConsumeProductSchema = new Schema(
  {
    product: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "exercise",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
    amount: {
      type: Number,
      min: 1,
      required: true,
    },
    calories: {
      type: Number,
      min: 1,
      required: true,
    },
    groupBloodNotAllowed: {
      type: Boolean,
      required: true,
    },
  },
  { versionKey: false }
);

const DiarySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: String,
      match: dateRegex,
      required: true,
    },
    doneExercises: {
      type: [DoneExerciseSchema],
      default: [],
    },
    consumedProducts: {
      type: [ConsumeProductSchema],
      default: [],
    },
    burnedCalories: {
      type: Number,
      min: 0,
      required: true,
    },
    consumedCalories: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

DiarySchema.post("save", handleSaveError);

DiarySchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

DiarySchema.post("findOneAndUpdate", handleSaveError);

export const diaryAddSchema = Joi.object({
  doneExercises: Joi.array().items({
    exercise: Joi.string().required().messages({
      "any.required": `missing required exercise field`,
    }),
    time: Joi.number().min(1).required().messages({
      "any.required": `missing required time field`,
    }),
    calories: Joi.number().min(1).required().messages({
      "any.required": `missing required calories field`,
    }),
  }),
  consumedProducts: Joi.array().items({
    product: Joi.string().required().messages({
      "any.required": `missing required product field`,
    }),
    amount: Joi.number().min(1).required().messages({
      "any.required": `missing required amount field`,
    }),
    calories: Joi.number().min(1).required().messages({
      "any.required": `missing required calories field`,
    }),
  }),
}).or("doneExercises", "consumedProducts");

export const diaryUpdateSchema = Joi.object({
  type: Joi.string().valid("exercise", "product").required().messages({
    "any.required": `missing required type field`,
  }),
  id: Joi.string().required().messages({
    "any.required": `missing required id field`,
  }),
});

export const Diary = model("diary", DiarySchema);
export const DoneExecises = model("doneExercises", DoneExerciseSchema);
