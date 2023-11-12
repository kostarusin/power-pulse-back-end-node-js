import Exercise from "../models/Exercise.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllExercises = async (req, res) => {
  const exercises = await Exercise.find();

  res.status(200).json(exercises);
};
const getAllExercisesTypes = async (req, res) => {
  const bodyPart = await Exercise.distinct("bodyPart").exec();
  const equipment = await Exercise.distinct("equipment").exec();
  const target = await Exercise.distinct("target").exec();

  res
    .status(200)
    .json({ bodyParts: bodyPart, equipments: equipment, targets: target });
};

export default {
  getAllExercises: ctrlWrapper(getAllExercises),
  getAllExercisesTypes: ctrlWrapper(getAllExercisesTypes),
};
