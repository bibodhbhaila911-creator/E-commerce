import mongoose from 'mongoose';

// local MongoDB running on this computer, database name = "ecommerce"
// when deployed, MONGO_URL comes from the hosting environment variables (e.g. MongoDB Atlas)
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce";

export async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("DB Connection success");
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}
