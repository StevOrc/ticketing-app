import { Subjects, Publisher, TicketCreatedEvent } from "@geksorg/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
