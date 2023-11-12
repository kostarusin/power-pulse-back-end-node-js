import Product from "../models/Product.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllProductsCategories = async (req, res) => {
  const productsCategories = await Product.find({}, "category").exec();

  res.json(productsCategories);
};

const getAllProductsGroupBloodNotAllowed = async (req, res) => {
  const { blood } = req.user;
  const productsCategories = await Product.find({}, "groupBloodNotAllowed");

  const formatProduct = productsCategories.filter(
    (product) => product.groupBloodNotAllowed[blood]
  );
  res.json({ products: formatProduct, blood });
};

export default {
  getAllProductsCategories: ctrlWrapper(getAllProductsCategories),
  getAllProductsGroupBloodNotAllowed: ctrlWrapper(
    getAllProductsGroupBloodNotAllowed
  ),
};
