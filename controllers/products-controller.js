import Product from "../models/Product.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllProductsCategories = async (req, res) => {
  const productsCategories = await Product.find({}, "category").exec();

  res.json(productsCategories);
};

const getAllProductsGroupBloodNotAllowed = async (req, res) => {
  const { blood, email } = req.user;
  const productsCategories = await Product.find({}, "groupBloodNotAllowed");
  const formatProduct = productsCategories.filter(function (e) {
    return e.groupBloodNotAllowed[blood] === true;
  });
  console.log(formatProduct);

  res.json({ productsCategories, blood, email });
};

export default {
  getAllProductsCategories: ctrlWrapper(getAllProductsCategories),
  getAllProductsGroupBloodNotAllowed: ctrlWrapper(
    getAllProductsGroupBloodNotAllowed
  ),
};
