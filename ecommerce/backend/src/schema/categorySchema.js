import { Schema, model } from "mongoose";

let categorySchema = Schema({
    name: {type: String, required: [true, "Category name is required"]},
    description: {type: String},
});

let Category = model("Category", categorySchema);

export default Category;
