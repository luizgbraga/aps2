import { Request, Response } from 'express';
import { TripRepository } from './repository';

const repository = new TripRepository();

export class TripController {
  static async getAllTrips(req: Request, res: Response) {
    try {
      const dbResults = await repository.getAllTrips();
      const result = dbResults.map((trip) => ({
        id: trip.id,
        route_id: trip.route_id,
        headsign: trip.headsign,
        direction: trip.direction,
      }));
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async addNewTrip(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const route_id = req.body.route_id;
      const headsign = req.body.headsign;
      const direction = req.body.direction;
      const result = await repository.addNewTrip(
        id,
        route_id,
        headsign,
        direction,
      );
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
