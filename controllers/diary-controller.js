import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import { Diary } from "../models/Diary.js";
import Exercise from "../models/Exercise.js";
import Product from "../models/Product.js";

const addDiary = async (req, res) => {
  const { _id: owner, blood } = req.user;
  const { date } = req.params;
  const conditions = { owner, date };
  let data;

  if (req.body.doneExercises && req.body.doneExercises.length > 0) {
    const { exercise, time, calories } = req.body.doneExercises[0];

    const foundExercise = await Exercise.findById(exercise).populate(
      "bodyPart equipment name target"
    );
    if (!foundExercise) {
      throw new HttpError(404, "There is no such exercise");
    }

    data = await Diary.findOneAndUpdate(
      conditions,
      {
        $inc: { burnedCalories: +calories },
        $push: {
          doneExercises: {
            exercise: foundExercise,
            time,
            calories,
          },
        },
      },
      { new: true }
    );
  }

  if (req.body.consumedProducts && req.body.consumedProducts.length > 0) {
    const { product, amount, calories } = req.body.consumedProducts[0];
  
    const foundProduct = await Product.findById(product).populate('title', 'category')
    const groupBloodNotAllowed = foundProduct.groupBloodNotAllowed[blood];
    if (!foundProduct) {
      throw HttpError(404, "These is no such product");
    }

    data = await Diary.findOneAndUpdate(
      conditions,
      {
        $inc: { consumedCalories: +calories },
        $push: {
          consumedProducts: {
            product: foundProduct,
            amount,
            calories,
            groupBloodNotAllowed,
          },
        },
      },
      { new: true }
    );
  }

  res.status(200).json(data);
};

const updateDiary = async (req, res) => {
  const { date } = req.params;
  const { _id: owner } = req.user;
  const { type, id } = req.body;
  const diary = await Diary.findOne({ owner, date });

  if (!diary) {
    throw HttpError(404, "Diary not found");
  }

  let arrayType;
  let update;

  if (type === "exercise") {
    const doneExerciseIndex = diary.doneExercises.findIndex(
      (item) => item._id && item._id.toString() === id
    );

    if (doneExerciseIndex === -1) {
      throw HttpError(404, "Exercise not found");
    } else {
      arrayType = "doneExercises";
      update = {
        $pull: { doneExercises: { _id: id } },
        $inc: {
          burnedCalories: -diary.doneExercises[doneExerciseIndex].calories,
        },
      };
    }
  } else if (type === "product") {
    const consumedProductIndex = diary.consumedProducts.findIndex(
      (item) => item._id && item._id.toString() === id
    );

    if (consumedProductIndex === -1) {
      throw HttpError(404, "Product not found");
    } else {
      arrayType = "consumedProducts";
      update = {
        $pull: { consumedProducts: { _id: id } },
        $inc: {
          consumedCalories:
            -diary.consumedProducts[consumedProductIndex].calories,
        },
      };
    }
  } else {
    throw HttpError(404, "Type of object is not defined");
  }

  const result = await Diary.findOneAndUpdate({ owner, date }, update, {
    new: true,
  });

  res.status(200).json(result);
};

const getDiary = async (req, res) => {
  const { _id: owner, createdAt } = req.user;
  const { date } = req.params;

  let result = await Diary.findOne({ owner, date });

  if (!result) {
    try {
      const basicSettings = {
        doneExercises: [],
        consumedProducts: [],
        burnedCalories: 0,
        consumedCalories: 0,
      };
      result = await Diary.create({ owner, date, ...basicSettings });
      res.status(201).json(result);
    } catch (error) {
      throw HttpError(500, "Failed to create diary entry");
    }
  } else {
    res.status(200).json(result);
  }
};

export default {
  addDiary: ctrlWrapper(addDiary),
  updateDiary: ctrlWrapper(updateDiary),
  getDiary: ctrlWrapper(getDiary),
};
