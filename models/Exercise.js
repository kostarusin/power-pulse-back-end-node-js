import { Schema, model } from "mongoose";

const exerciseSchema = new Schema();

const Exercise = model("exercise", exerciseSchema);

export default Exercise;
