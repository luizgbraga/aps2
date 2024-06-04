import { Request, Response } from 'express';
import { FakeSensorRepository } from './repository';

const sensorRepository = new FakeSensorRepository();

export class SensorController {
  static async list(req: Request, res: Response) {
    try {
      const result = await sensorRepository.list();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
