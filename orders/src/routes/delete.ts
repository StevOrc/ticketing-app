import express, { Request, Response } from "express";
import { NotAuthorizedError, OrderStatus, requireAuth } from "@geksorg/common";
import { Order } from "../models/order";
import { BadRequestError } from "@geksorg/common";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new BadRequestError("Order not found...");
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
