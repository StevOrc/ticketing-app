import { Publisher, Subjects, PaymentCreatedEvent } from "@geksorg/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
