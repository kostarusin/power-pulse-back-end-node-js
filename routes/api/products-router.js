import express from "express";
import productsController from "../../controllers/products-controller.js";
import authenticate from "../../middlewares/authenticate.js";

const productRouter = express.Router();

productRouter.use(authenticate);

productRouter.get("/", productsController.getAllProductsCategories);

export default productRouter;
