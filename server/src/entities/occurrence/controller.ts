import { Request, Response } from 'express';
import { OccurrenceRepository } from './repository';
import { OccurenceType } from './schema';

const repository = new OccurrenceRepository();

export class OccurrenceController {
  static async propose(req: Request, res: Response) {
    try {
      const type = req.body.type as OccurenceType;
      const description = req.body.description;
      const neighborhoodId = req.body.neighborhoodId;
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      const result = await repository.create(
        type,
        description,
        neighborhoodId,
        latitude,
        longitude,
        100,
        false,
      );
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async all(req: Request, res: Response) {
    try {
      const result = await OccurrenceRepository.all();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const result = await repository.list(userId);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async listToApprove(req: Request, res: Response) {
    try {
      const result = await OccurrenceRepository.listToApprove();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async listToApprove(req: Request, res: Response) {
    try {
      const result = await OccurrenceRepository.listToApprove();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async confirm(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await repository.confirm(id);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await OccurrenceRepository.delete(id);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await OccurrenceRepository.delete(id);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
