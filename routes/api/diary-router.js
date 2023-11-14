import express from "express";

import diaryController from "../../controllers/diary-controller.js";
import { validateBody } from "../../decorators/index.js";
import {diaryAddSchema} from "../../models/Diary.js"
import {authenticate, isEmptyBody} from "../../middlewares/index.js";

const dairyAddValidate = validateBody(diaryAddSchema);

const diaryRouter = express.Router();

diaryRouter.use(authenticate);

diaryRouter.post("/:date", isEmptyBody, dairyAddValidate, diaryController.addDiary);

diaryRouter.get("/:date", diaryController.getDiary);

diaryRouter.patch("/:date", isEmptyBody, diaryController.updateDiary);

export default diaryRouter;