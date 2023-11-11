import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, upload } from "../../middlewares/index.js";

import {
  userSignupSchema,
  userSigninSchema,
  userDetailsSchema,
} from "../../utils/validation/authValidationScemas.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userDetailsValidate = validateBody(userDetailsSchema);

const authRouter = express.Router();

authRouter.post("/signup", userSignupValidate, authController.signup);

authRouter.post(
  "/enterdetails",
  authenticate,
  userDetailsValidate,
  authController.enterDetails
);

authRouter.post("/signin", userSigninValidate, authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.patch(
  "/basicinfo",
  authenticate,
  upload.single("avatar"),
  authController.updateBasicInfo
);

authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
