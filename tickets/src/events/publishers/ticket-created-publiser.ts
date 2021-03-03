import { Publisher, Subjects, TicketCreatedEvent } from "@geksorg/common";

export class TicketCreaedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
