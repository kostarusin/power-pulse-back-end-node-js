import express from "express";

import diaryController from "../../controllers/diary-controller.js";
import { validateBody } from "../../decorators/index.js";
import {diaryAddSchema} from "../../models/Diary.js"
import {authenticate, isEmptyBody, isDateValid} from "../../middlewares/index.js";

const dairyAddValidate = validateBody(diaryAddSchema);

const diaryRouter = express.Router();

diaryRouter.use(authenticate);

diaryRouter.post("/:date", isEmptyBody, isDateValid, dairyAddValidate, diaryController.addDiary);

diaryRouter.get("/:date", isDateValid, diaryController.getDiary);

diaryRouter.patch("/:date", isEmptyBody, isDateValid, diaryController.updateDiary);

export default diaryRouter;