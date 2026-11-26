// make express application and attach port to it

import express from "express";
import { json } from "body-parser";
import cors from "cors";
import { connectToMongoDB as connectToDB } from "./src/connectTODB.js";
import ProductRoute from "./src/route/productRoute.js";
import CategoryRoute from "./src/route/categoryRoute.js";
import UserRoute from "./src/route/userRoute.js";
import OrderRoute from "./src/route/orderRoute.js";
const app = express();

connectToDB();

// Vercel runs the exported app itself, so only listen when running locally
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.use(cors()); //enable cors
app.use(json()); //make backend capable to take json data

app.use("/product", ProductRoute);
app.use("/category", CategoryRoute);
app.use("/user", UserRoute);
app.use("/order", OrderRoute);

export default app;
