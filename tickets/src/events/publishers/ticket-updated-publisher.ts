import { Publisher, Subjects, TicketUpdatedEvent } from "@geksorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
