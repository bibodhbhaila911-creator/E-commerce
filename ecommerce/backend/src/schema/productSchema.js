import { Schema, model } from "mongoose";

let productSchema = Schema({
    name: {type: String, required: [true, "Product name is required"]},
    description: {type: String},
    price: {type: Number, required: [true, "Product price is required"]},
    quantity: {type: Number, required: [true, "Product quantity is required"]},
    category: {type: String, required: [true, "Product category is required"]},
    image: {type: String},
});

let Product = model("Product", productSchema);

export default Product;
