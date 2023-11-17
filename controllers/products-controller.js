import Product from "../models/Product.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllProductsCategories = async (req, res) => {
  const productsCategories = await Product.distinct("category").exec();
  productsCategories.unshift("all")

  res.status(200).json(productsCategories);
};

const getAllProductsByGroupBlood = async (req, res) => {
  const { blood } = req.user;
  const productsCategories = await Product.find({});
  const productsAllowed = [];

  productsCategories.forEach((item) => {
    if (item.groupBloodNotAllowed[blood]) {
      productsAllowed.push({ item, allowed: true });
    } else productsAllowed.push({ item, allowed: false });
  });

  res.status(200).json({ products: productsAllowed });
};

export default {
  getAllProductsCategories: ctrlWrapper(getAllProductsCategories),
  getAllProductsByGroupBlood: ctrlWrapper(
    getAllProductsByGroupBlood
  ),
};
