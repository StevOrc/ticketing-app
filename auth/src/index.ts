import mongoose from "mongoose";
import { app } from "./app";

const port = process.env.PORT || 3000;
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be priveded");
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Connected to MongoDb...`);
  } catch (error) {
    console.log("error");
  }
  app.listen(port, () => {});
};

start();
