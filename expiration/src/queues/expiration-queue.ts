import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order-expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// Une fois reçu le Job de Redis
// on publish un event pour notamment prévenir Order que le temps s'est écoulé
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
