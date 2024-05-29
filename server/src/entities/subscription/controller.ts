import { Request, Response } from 'express';
import { SubscriptionRepository } from './repository';

export class SubscriptionController {
  static async subscribe(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const neighborhoodId = req.body.neighborhoodId;
      const result = await SubscriptionRepository.subscribe(
        userId,
        neighborhoodId,
      );
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
