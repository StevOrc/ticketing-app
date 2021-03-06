import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

jest.mock("../nats-wrapper");

let mongo: any;

// Avant tous les tests : Connexion à la BB mongo en mémoire 'MongoMemoryServer'
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Avant chaque test:
//  - Clear tous les mocks (collections)
//  - On récupère tous les collection de la BD et on delete toute les données de chacune
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Apèrs chaque test:
//  - on se déconecte de mongo
//  - On close toute les collections
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Méthide de signup qui va permettre de créer un user
// Se connecter avec ce user créé et retourner une session avec le cookie
global.signup = () => {
  const id = mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "test@test.fr",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};
