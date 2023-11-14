import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import { Diary } from "../models/Diary.js";
import Exercise from "../models/Exercise.js";
import Product from "../models/Product.js";

const addDiary = async (req, res) => {
  const { _id: owner, blood } = req.user;
  const { date } = req.params;
  const { doneExercises, consumedProducts } = req.body;

  const conditions = { owner, date };
  const update = {};
  let burnedCalories = 0;
  let consumedCalories = 0;

  if (doneExercises && doneExercises.length > 0) {
    const updatedDoneExercises = [];
    for (const exerciseObj of doneExercises) {
      const { exercise, time, calories } = exerciseObj;
      const foundExercise = await Exercise.findById(exercise);

      const newExercise = {
        exercise, 
        time, 
        calories,
        bodyPart: foundExercise.bodyPart,
        equipment:foundExercise.equipment,
        name: foundExercise.name,
        target: foundExercise.target,
      }
   
      updatedDoneExercises.push(newExercise);
      burnedCalories += calories;
    
  }
  update.$addToSet = { doneExercises: { $each: updatedDoneExercises } };
}

if (consumedProducts && consumedProducts.length > 0) {

  const updatedConsumedProducts = [];
  for (const productObj of consumedProducts) {
    const { product, amount, calories } = productObj;
    const foundProduct = await Product.findById(product);
    const newProduct = {
      product, 
      amount, 
      calories,
      title: foundProduct.title,
      category: foundProduct.category,
      groupBloodNotAllowed: foundProduct.groupBloodNotAllowed[blood],
    }
 
    updatedConsumedProducts.push(newProduct);
    consumedCalories += calories;
  
}
update.$addToSet = { consumedProducts: { $each: updatedConsumedProducts } };
}
 update.$inc = { burnedCalories, consumedCalories };

  const options = { new: true, upsert: true };
  const result = await Diary.findOneAndUpdate(conditions, update, options);

  res.status(200).json(result);
};

const updateDiary = async (req, res) => {
  const { date } = req.params;
  const { _id: owner } = req.user;
  const { id } = req.body;
  const diary = await Diary.findOne({ owner, date });

  if (!diary) {
    throw HttpError(404, "Diary not found");
  }

  let arrayType;
  let update;

  if (diary.doneExercises) {
    const doneExerciseIndex = diary.doneExercises.findIndex(
      (item) => item._id && item._id.toString() === id
    );

    if (doneExerciseIndex !== -1) {
      arrayType = "doneExercises";
      update = {
        $pull: { doneExercises: { _id: id } },
        $inc: {
          burnedCalories: -diary.doneExercises[doneExerciseIndex].calories,
        },
      };
    }
  }

  if (!arrayType && diary.consumedProducts) {
    const consumedProductIndex = diary.consumedProducts.findIndex(
      (item) => item._id && item._id.toString() === id
    );

    if (consumedProductIndex !== -1) {
      arrayType = "consumedProducts";
      update = {
        $pull: { consumedProducts: { _id: id } },
        $inc: {
          consumedCalories:
            -diary.consumedProducts[consumedProductIndex].calories,
        },
      };
    }
  }

  if (!arrayType) {
    throw HttpError(404, "Item not found in diary");
  }

  const result = await Diary.findOneAndUpdate({ owner, date }, update, {
    new: true,
  });

  res.status(200).json(result);
};

const getDiary = async (req, res) => {
  const { _id: owner, createdAt } = req.user;
  const { date } = req.params;

  const dateParts = date.split("-");
  if (dateParts.length !== 3) {
    throw HttpError(400, "Invalid date format");
  }

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);

  const requestDate = new Date(year, month, day);
  const registrationDate = new Date(createdAt);
  const today = new Date();

  if (isNaN(requestDate.getTime())) {
    throw HttpError(400, "Invalid date format");
  }

  if (
    requestDate <
      new Date(
        registrationDate.getFullYear(),
        registrationDate.getMonth(),
        registrationDate.getDate()
      ) ||
    requestDate >
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
  ) {
    throw HttpError(400, "Date should be between registration date and today");
  }

  const result = await Diary.findOne({ owner, date });

  if (!result) {
    throw HttpError(404, "Diary not found");
  }

  res.status(200).json(result);
};

export default {
  addDiary: ctrlWrapper(addDiary),
  updateDiary: ctrlWrapper(updateDiary),
  getDiary: ctrlWrapper(getDiary),
};
