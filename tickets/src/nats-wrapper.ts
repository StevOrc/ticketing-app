import nats, { Stan } from "node-nats-streaming";

// Mise en place d'une classe pour la gestion d'un NATS Singleton
class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client)
      throw Error("Cannot access NATS client before connection");

    return this._client;
  }

  connect(clusterId: string, clienyId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clienyId, { url });

    return new Promise((resolve, reject) => {
      // TS se plaind car _client étant dans une callback
      // => il se dit que peut être undefined ou re assigned
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
