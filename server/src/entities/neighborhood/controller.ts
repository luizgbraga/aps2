import { Request, Response } from 'express';
import { NeighborhoodRepository } from './repository';

export class NeighborhoodController {
  static async fill(req: Request, res: Response) {
    try {
      const result = await NeighborhoodRepository.fill();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const result = await NeighborhoodRepository.list();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
