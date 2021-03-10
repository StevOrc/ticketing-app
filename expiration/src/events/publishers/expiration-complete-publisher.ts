import { Subjects, Publisher, ExpirationCompleteEvent } from "@geksorg/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
