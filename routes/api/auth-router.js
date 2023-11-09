import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { authenticate } from "../../middlewares/index.js";

import {
  userSignupSchema,
  userSigninSchema,
  userSubscriptionUpdateSchema,
} from "../../utils/validation/authValidationScemas.js";

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userSubscriptionValidate = validateBody(userSubscriptionUpdateSchema);

const authRouter = express.Router();

authRouter.post("/signup", userSignupValidate, authController.signup);

authRouter.post("/signin", userSigninValidate, authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.patch(
  "/users",
  userSubscriptionValidate,
  authenticate,
  authController.subscriptionUpdate
);

export default authRouter;
