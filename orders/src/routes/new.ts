import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { requireAuth, validationRequest, NotFoundError } from "@geksorg/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders/new",
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
    const ticket = await Ticket.findById(ticketId);
    if (!Ticket) throw new NotFoundError();

    res.send({ order: req.body });
  }
);

export { router as newOrderRouter };
