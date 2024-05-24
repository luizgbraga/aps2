import { Request, Response } from 'express';
import { FakeSensorRepository } from './repository';

const sensorRepository = new FakeSensorRepository();

export class SensorController {
  static async check(req: Request, res: Response) {
    try {
      const latitude = parseFloat(req.body.latitude);
      const longitude = parseFloat(req.body.longitude);
      const result = await sensorRepository.check(latitude, longitude);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
