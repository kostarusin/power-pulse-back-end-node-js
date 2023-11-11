import Product from "../models/Products.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllProducts = async (req, res) => {
  const productsList = await Product.find({}, "category").exec();

  res.json(productsList);
};

export default {
  getAllProducts: ctrlWrapper(getAllProducts),
};
