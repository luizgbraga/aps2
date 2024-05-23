import { Request, Response } from 'express';
import { NeighborhoodType } from './schema';

export class NeighborhoodController {
  async getById(req: Request, res: Response) {
    const id = req.body.id;
  }
}
