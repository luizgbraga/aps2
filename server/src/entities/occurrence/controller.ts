import { Request, Response } from 'express';
import { OccurrenceRepository } from './repository';
import { OccurenceType } from './schema';

export class OccurrenceController {
  static async add(req: Request, res: Response) {
    try {
      const type = req.body.type as OccurenceType;
      const description = req.body.description;
      const neighborhoodId = req.body.neighborhoodId;
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      const radius = req.body.radius as number;
      const confirmed = req.body.confirmed as boolean;
      const result = await OccurrenceRepository.add(
        type,
        description,
        neighborhoodId,
        latitude,
        longitude,
        radius,
        confirmed,
      );
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const result = await OccurrenceRepository.list(userId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async confirm(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await OccurrenceRepository.confirm(id);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
