import { queueGroupName } from "./queue-group-name";
import { Listener, OrderCreatedEvent, Subjects } from "@geksorg/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, version, userId, status, ticket } = data;
    const order = Order.build({
      id,
      version,
      status,
      userId,
      price: ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
