import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, upload } from "../../middlewares/index.js";

import {
  userSignupSchema,
  userSigninSchema,
  userInfoSchema,
} from "../../utils/validation/authValidationScemas.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userInfoValidate = validateBody(userInfoSchema);

const authRouter = express.Router();

authRouter.post("/signup", userSignupValidate, authController.signup);

authRouter.post("/calories", authenticate, authController.calculateCalories);

authRouter.post("/signin", userSigninValidate, authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.patch(
  "/updatedetails",
  authenticate,
  upload.single("avatar"),
  userInfoValidate,
  authController.updateUserInfo
);

authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
