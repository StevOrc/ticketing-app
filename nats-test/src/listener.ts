import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected ton NATS");

  const sub = stan.subscribe("ticket:created", "orders-service-queue-group");

  sub.on("message", (msg: Message) => {
    let data = msg.getData();
    if (typeof data === "string")
      console.log(`Received event "${msg.getSequence()}, data ${data}`);
  });
});
