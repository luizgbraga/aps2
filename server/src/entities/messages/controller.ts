import { Request, Response } from 'express';
import { repositories } from '../../entities/factory';
import { MessagesRepository } from './repository';

export class MessagesController {
  static async list(req: Request, res: Response) {
    try {
      const routeId = req.query.routeId as string;
      const result = await repositories.messages.list(routeId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async all(req: Request, res: Response) {
    try {
      const result = await repositories.messages.all();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
