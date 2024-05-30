import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

export type RouteDTO = {
  id: string;
  short_name: string;
  long_name: string;
  desc_name: string;
  type: string;
  color: string;
  text_color?: string;
};

class RoutesAPI extends API {
  constructor() {
    super(`${API_URL}/route`);
  }

  async getAllRoutes(): Promise<Response<RouteDTO[]>> {
    return this.request('GET', '/allRoutes', null, null, null);
  }
}

const api = new RoutesAPI();

export class RoutesModel {
  static async getAllRoutes() {
    const res = await api.getAllRoutes();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
