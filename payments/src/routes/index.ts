import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { Payment } from "../models/payment";

const router = express.Router();

router.get("/api/payments/charges", async (req: Request, res: Response) => {
  const orders = await Order.find();

  res.status(200).send(orders);
});

router.get("/api/payments", async (req: Request, res: Response) => {
  const payments = await Payment.find();

  res.status(200).send(payments);
});

export { router as indexRouter };
