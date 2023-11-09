import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactUpdateFavoriteSchema,
} from "../../utils/validation/contactValidationSchemas.js";
import { authenticate, isValidId } from "../../middlewares/index.js";

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.post("/", contactAddValidate, contactsController.add);

contactsRouter.put(
  "/:id",
  isValidId,
  contactAddValidate,
  contactsController.updateById
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  contactUpdateFavoriteValidate,
  contactsController.updateStatusContact
);

contactsRouter.delete("/:id", isValidId, contactsController.deleteById);

export default contactsRouter;
