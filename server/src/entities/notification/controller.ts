import { Request, Response } from 'express';
import { NotificationRepository } from './repository';

export class NotificationController {
  static async add(req: Request, res: Response) {
    try {
      const description = req.body.description;
      const neighborhoodId = req.body.neighborhoodId;
      const result = await NotificationRepository.add(description, neighborhoodId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
