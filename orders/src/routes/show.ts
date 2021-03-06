import express, { Request, Response } from "express";
import { NotAuthorizedError, requireAuth } from "@geksorg/common";
import { Order } from "../models/order";
import { BadRequestError } from "@geksorg/common";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new BadRequestError("Order no found...");
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
