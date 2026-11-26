import { Schema, model } from "mongoose";

let orderSchema = Schema({
    userName: {type: String, required: [true, "Customer name is required"]},
    productName: {type: String, required: [true, "Product name is required"]},
    quantity: {type: Number, required: [true, "Order quantity is required"]},
    totalPrice: {type: Number, required: [true, "Total price is required"]},
    address: {type: String, required: [true, "Delivery address is required"]},
    status: {type: String, default: "Pending"},
});

let Order = model("Order", orderSchema);

export default Order;
