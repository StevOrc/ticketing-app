import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@geksorg/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data : ", data);

    msg.ack();
  }
}
