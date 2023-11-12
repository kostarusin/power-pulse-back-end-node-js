import { Schema, model } from "mongoose";

const exerciseSchema = new Schema({
  bodyPart: { type: String, required: true },
  equipment: { type: String, required: true },
  gifUrl: { type: String, required: true },
  name: { type: String, required: true },
  target: { type: String, required: true },
  burnedCalories: { type: Number, required: true },
  time: { type: Number, required: true },
});

const Exercise = model("exercise", exerciseSchema);

export default Exercise;
