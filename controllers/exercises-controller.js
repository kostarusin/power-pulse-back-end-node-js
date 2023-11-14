import Exercise from "../models/Filter.js";
import Filters from "../models/Filter.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllExercises = async (req, res) => {
  const exercises = await Exercise.find();

  res.status(200).json(exercises);
};
const getAllExercisesTypes = async (req, res) => {
    const bodyParts = await Filters.find({ filter: { $in: 'Body parts' } });
    const equipment = await Filters.find({ filter: { $in: 'Equipment' } });
    const muscles = await Filters.find({ filter: { $in: 'Muscles' } });
    res.status(200).json({ bodyParts, equipment, muscles});
    console.error('Ошибка при поиске категорий:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};

export default {
  getAllExercises: ctrlWrapper(getAllExercises),
  getAllExercisesTypes: ctrlWrapper(getAllExercisesTypes),
};
