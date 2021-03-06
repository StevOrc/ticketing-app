import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validationRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@geksorg/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket id is required"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket in the DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket)
      throw new BadRequestError("Ticket not found with the given ID...");

    // Test if the ticket is reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Set an exipration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expireAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event saying that an order is created

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
