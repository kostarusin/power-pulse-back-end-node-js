import Exercise from "../models/Exercise.js";
import Filters from "../models/Filter.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllExercises = async (req, res) => {
  const exercises = await Exercise.find();

  res.status(200).json(exercises);
};
const getAllExercisesTypes = async (req, res) => {
    const bodyPart = await Filters.find({ filter: 'Body partы' });
    const equipment = await Filters.find({ filter: 'Equipment' });
    const muscles = await Filters.find({ filter: 'Muscles'  });
    res.status(200).json({ bodyPart, equipment, muscles});
};

export default {
  getAllExercises: ctrlWrapper(getAllExercises),
  getAllExercisesTypes: ctrlWrapper(getAllExercisesTypes),
};
