import { Request, Response } from 'express';
import { ShapeRepository } from './repository';
import { GetShapeBadRequestError, GetShapeError } from './errors';

export class RouteController {
  static async getShape(req: Request, res: Response) {
    try {
      if (!req.query.trip_id)
        throw new GetShapeBadRequestError("MISSING 'trip_id' QUERY PARAMETER");
      const trip_id = req.query.trip_id.toString();
      const dbResults = await ShapeRepository.getShape(trip_id);
      const result = dbResults.map((shape: any) => ({
        pt_sequence: shape.pt_sequence,
        pt_lat: shape.pt_lat,
        pt_lon: shape.pt_lon,
        dist_traveled: shape.dist_traveled,
      }));
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      if (error instanceof GetShapeBadRequestError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
  static async addNewShape(req: Request, res: Response) {
    try {
      const trip_id = req.body.trip_id;
      const pt_sequence = req.body.pt_sequence;
      const pt_lat = req.body.pt_lat;
      const pt_lon = req.body.pt_lon;
      const dist_traveled = req.body.dist_traveled;
      const result = await ShapeRepository.addNewShape(
        trip_id,
        pt_sequence,
        pt_lat,
        pt_lon,
        dist_traveled,
      );
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
