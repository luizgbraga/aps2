import { Request, Response } from 'express';
import { RouteRepository } from './repository';
import { repositories } from '../factory';

const routeTypeMap: { [key: number]: string } = {
  200: 'frescao',
  700: 'onibus',
  702: 'brt',
};

const colorFormatterMap: { [key: string]: string } = {
  ffffff: '#FFFFFF',
  '0': '#000000',
};

export class RouteController {
  static async getAllRoutes(req: Request, res: Response) {
    try {
      const dbResults = await repositories.route.getAllRoutes();
      const result = dbResults.map((route) => ({
        id: route.id,
        short_name: route.short_name,
        long_name: route.long_name,
        desc_name: route.desc_name ?? '',
        type: routeTypeMap[route.type],
        color: route.color,
        text_color: colorFormatterMap[route.text_color],
        inactive: route.inactive,
      }));
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async addNewRoute(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const short_name = req.body.short_name;
      const long_name = req.body.long_name;
      const desc_name = req.body.desc_name;
      const type = req.body.type;
      const color = req.body.color;
      const text_color = req.body.text_color;
      const result = await repositories.route.addNewRoute(
        id,
        short_name,
        long_name,
        desc_name,
        type,
        color,
        text_color,
      );
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
