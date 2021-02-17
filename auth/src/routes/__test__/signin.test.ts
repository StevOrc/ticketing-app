import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "testa@test.com",
      password: "password",
    })
    .expect(404);
});

it("fails when a in incorrect password is given", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password2",
    })
    .expect(404);
});

it("respond with a cookie when good credential", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
