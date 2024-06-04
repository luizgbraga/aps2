import { Request, Response } from 'express';
import { AdminRepository } from './repository';

export class AdminController {
  static async login(req: Request, res: Response) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const result = await AdminRepository.login(username, password);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const result = await AdminRepository.me(userId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
