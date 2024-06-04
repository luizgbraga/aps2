import { Request, Response } from 'express';
import { MessagesRepository } from './repository';

export class MessagesController {
  static async list(req: Request, res: Response) {
    try {
      const routeId = req.query.routeId as string;
      const result = await MessagesRepository.list(routeId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}