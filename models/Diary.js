import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-\d{4}$/;

const DoneExerciseSchema = new Schema(
  {
    exercise: {
      type: Schema.Types.ObjectId,
      ref: 'exercise',
      required: true,
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
    }
  },
  { versionKey: false }
);

const ConsumeProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
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
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    groupBloodNotAllowed: {
      type: Boolean,
      required: true,
    }
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
      default: undefined,
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message:
          "At least one of fields should be filled: doneExercises or consumedProducts",
      },
    }, 
    consumedProducts: {
      type: [ConsumeProductSchema],
      default: undefined,
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message:
          "At least one of fields should be filled: doneExercises or consumedProducts",
      },
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
  { versionKey: false, timestamps: { currentTime: () => Date.now() + 7200000 } }
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
  burnedCalories: Joi.number().min(0),
  consumedCalories: Joi.number().min(0),
}).xor("doneExercises", "consumedProducts");

export const Diary = model("diary", DiarySchema);
export const DoneExecises = model("doneExercises", DoneExerciseSchema);
