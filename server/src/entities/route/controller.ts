import { Request, Response } from 'express';
import { RouteRepository } from './repository';

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
      const dbResults = await RouteRepository.getAllRoutes();
      const result = dbResults.map((route: any) => ({
        short_name: route.short_name,
        long_name: route.long_name,
        desc: route.desc ?? '',
        type: routeTypeMap[route.type],
        color: colorFormatterMap[route.color],
        text_color: colorFormatterMap[route.text_color],
      }));
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async addNewRoute(req: Request, res: Response) {
    try {
      const result = await RouteRepository.getAllRoutes();
      res.status(200).json({ result, type: 'SUCCESS' });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
