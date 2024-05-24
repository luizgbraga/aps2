export class SensorError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "SensorError";
    }
  }
  