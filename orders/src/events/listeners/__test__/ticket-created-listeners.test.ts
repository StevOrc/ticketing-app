import { TicketCreatedListener } from "./../ticket-created-listener";
import { natsWrapper } from "./../../../nats-wrapper";
import { TicketCreatedEvent } from "@geksorg/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "NBA LA",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake msg: Message object
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it("creates and save a ticket", async () => {
  const { listener, msg, data } = await setup();
  // Call onMessage fn with the data and msg
  await listener.onMessage(data, msg);
  // write an assertion to make sure a ticket is created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
