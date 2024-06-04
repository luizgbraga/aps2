import { Request, Response } from 'express';
import { AffectRepository } from './repository';
import { GetAffectedRoutesQueryError } from './errors';

export class AffectController {
  static async getAffectedRoutes(req: Request, res: Response) {
    try {
      if (!req.query.trip_id)
        throw new GetAffectedRoutesQueryError("MISSING 'occurence_id' QUERY PARAMETER");
      const occurence_id = req.query.occurence_id.toString();
      const result = await AffectRepository.getAffectedRoutes(occurence_id);
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      if (error instanceof GetAffectedRoutesQueryError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
}
