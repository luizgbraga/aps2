import { Request, Response } from 'express';
import { UserRepository } from './repository';

export class UserController {
  static async me(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const result = await UserRepository.me(userId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const cpf = req.body.cpf;
      const password = req.body.password;
      const result = await UserRepository.register(cpf, password);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const cpf = req.body.cpf;
      const password = req.body.password;
      const result = await UserRepository.login(cpf, password);
      console.log(result);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
