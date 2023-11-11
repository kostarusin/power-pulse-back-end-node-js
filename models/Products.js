import { Schema, model } from "mongoose";

const productSchema = new Schema();

const Product = model("product", productSchema);

export default Product;
