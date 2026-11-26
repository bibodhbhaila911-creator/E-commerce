import { model, Schema } from "mongoose";

let userSchema = Schema({
    name: {type: String, required: [true, "User name is required"]},
    email: {type: String, required: [true, "User email is required"]},
    password: {type: String, required: [true, "User password is required"]},
    address: {type: String, required: [true, "User address is required"]},
    phone: {type: String, required: [true, "User phone is required"]},
});

let User = model("User", userSchema);

export default User;
