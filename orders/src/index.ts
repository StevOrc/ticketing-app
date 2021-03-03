import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const port = process.env.PORT || 3000;
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be priveded");
  if (!process.env.MONGO_URI) throw new Error("MONGO URI must be provided");
  try {
    // Le 1er agrument doit être l'argument qu'on passe dans le fichier yaml pour NATS
    // Le 3eme agrument doit être le nom du service pour se connecter à NATS
    await natsWrapper.connect("ticketing", "dchjqdc", "http://nats-srv:4222");
    natsWrapper.client.on("close", () => {
      console.log("NATS connection close");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
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
