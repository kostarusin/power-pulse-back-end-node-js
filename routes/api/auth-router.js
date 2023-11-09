import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate, upload } from "../../middlewares/index.js";

import {
  userSignupSchema,
  userSigninSchema,
  userSubscriptionUpdateSchema,
  userEmailSchema,
} from "../../utils/validation/authValidationScemas.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userSubscriptionValidate = validateBody(userSubscriptionUpdateSchema);
const userEmailValidate = validateBody(userEmailSchema);

const authRouter = express.Router();

authRouter.post("/signup", userSignupValidate, authController.signup);

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.get("/verify", userEmailValidate, authController.resendVerifyEmail);

authRouter.post("/signin", userSigninValidate, authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch(
  "/users",
  upload.single("avatar"),
  userSubscriptionValidate,
  authenticate,
  authController.subscriptionUpdate
);

authRouter.patch(
  "/users/avatars",
  upload.single("avatar"),
  authenticate,
  authController.avatarUpdate
);

export default authRouter;
