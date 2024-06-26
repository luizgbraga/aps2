import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Routes } from './routes';
import { FakeSensorRepository } from './entities/sensor/repository';
import { OccurrenceRepository } from './entities/occurrence/repository';

const POLLING_INTERVAL = 10000;

export class Server {
  constructor(app: Application) {
    this.middlewares(app);
    new Routes(app);
  }

  private middlewares(app: Application) {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.json());
    app.use(cors());
  }

  async startPolling() {
    const sensorRepository = new FakeSensorRepository();
    const occurrenceRepository = new OccurrenceRepository();
    setInterval(async () => {
      const sensorsStatuses = await sensorRepository.getAllStatuses();
      await occurrenceRepository.updateOccurrencesFromSensorsStatuses(
        sensorsStatuses,
      );
    }, POLLING_INTERVAL);
  }
}
