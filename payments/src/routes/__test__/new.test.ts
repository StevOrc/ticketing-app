import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@geksorg/common";
import { stripe } from "./../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asldkfj",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "nkjdcs",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 10,
    status: OrderStatus.Cancelled,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(userId))
    .send({
      orderId: order.id,
      token: "jdsjcnsd",
    })
    .expect(404);
});

it("returns a 201 with valid inputs", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargesOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargesOptions.source).toEqual("tok_visa");
  expect(chargesOptions.amount).toEqual(20 * 100);
  expect(chargesOptions.currency).toEqual("usd");

  // This is more Realistic test by doing a request to real Strip Endpoint
  // Whe list the x last charges and do a filter and find the one we create
  // and finnaly do the expectations

  // const stripeCharges = await stripe.charges.list({ limit: 50 });
  // const stripeCharge = stripeCharges.data.find((charge) => {
  //   return charge.amount === price * 100;
  // });
  // expect(stripeCharge).toBeDefined();
  // expect(stripeCharge!.currency).toEqual("usd");
  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   stripeId: stripeCharge!.id,
  // });
  // expect(payment).not.toBeNull();
});
