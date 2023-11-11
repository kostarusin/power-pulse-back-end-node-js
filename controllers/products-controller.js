import Product from "../models/Product.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllProductsCategories = async (req, res) => {
  const productsCategories = await Product.find({}, "category").exec();

  res.json(productsCategories);
};

export default {
  getAllProductsCategories: ctrlWrapper(getAllProductsCategories),
};
