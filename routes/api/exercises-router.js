import express from "express";
import exercisesController from "../../controllers/exercises-controller.js";
import authenticate from "../../middlewares/authenticate.js";

const exerciseRouter = express.Router();

exerciseRouter.use(authenticate);

exerciseRouter.get("/", exercisesController.getAllExercises);

export default exerciseRouter;
