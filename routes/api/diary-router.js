import express from "express";

import diaryController from "../../controllers/diary-controller.js";
import { validateBody } from "../../decorators/index.js";
import {diaryAddSchema} from "../../models/Diary.js"
import {authenticate, isEmptyBody} from "../../middlewares/index.js";

const dairyAddValidate = validateBody(diaryAddSchema);

const diaryRouter = express.Router();

diaryRouter.use(authenticate);

diaryRouter.post("/", isEmptyBody, dairyAddValidate, diaryController.addDiary);

diaryRouter.patch("/:id", isEmptyBody, diaryController.updateDiary);

diaryRouter.patch("/", isEmptyBody, diaryController.getDiary)

export default diaryRouter;