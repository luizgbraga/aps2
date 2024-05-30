import { Request, Response } from 'express';
import { z } from 'zod';
import { coordinateSchema } from './schemas';
import { FakeSensorRepository } from './repository';
import { NotFoundError } from './errors';

const sensorRepository = new FakeSensorRepository();

export class SensorController {
  static async getStatus(req: Request, res: Response) {
    try {
      const query = coordinateSchema.parse(req.query);
      const { latitude, longitude } = query;

      const sensor = await sensorRepository.check(latitude, longitude);
      if (sensor) {
        res.status(200).json({
          result: {
            flood: sensor.flood,
            landslide: sensor.landslide,
            congestion: sensor.congestion,
          },
          type: 'SUCCESS',
        });
      } else {
        res.status(200).json({ result: null, type: 'SUCCESS' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ result: { message: 'Invalid latitude or longitude' }, type: 'ERROR' });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({ result: { message: error.message }, type: 'ERROR' });
      } else {
        res.status(500).json({ result: { message: 'Internal Server Error' }, type: 'ERROR' });
      }
    }
  }
}
