import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const builTicket = async () => {
  const ticket = Ticket.build({
    title: "NBA",
    price: 150,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  return ticket;
};

it("fetches orders for an particular user", async () => {
  // Create few tickets
  const ticketOne = await builTicket();
  const ticketTwo = await builTicket();
  const ticketThree = await builTicket();

  const userOne = global.signup();
  const userTwo = global.signup();

  //   Create one order as user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  //   Create one order as user #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  //   Make request to get  orders for user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(201);
  //   Make sure we only get  the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
