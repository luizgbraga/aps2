import { Request, Response } from 'express';
import { repositories } from '../../entities/factory';

export class NeighborhoodController {
  static async fill(req: Request, res: Response) {
    try {
      const result = await repositories.neighborhood.fill();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const result = await repositories.neighborhood.list();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getFromName(req: Request, res: Response) {
    try {
      const name = req.query.name as string;
      const result = await repositories.neighborhood.getFromName(name);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
