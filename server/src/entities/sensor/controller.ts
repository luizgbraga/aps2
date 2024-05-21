import { Request, Response } from 'express';
import { FakeSensorRepository } from './repository';

const sensorRepository = new FakeSensorRepository();

export class SensorController {
  static async check(req: Request, res: Response) {
    try {
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      const result = await sensorRepository.check(latitude, longitude);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
