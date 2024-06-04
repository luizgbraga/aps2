import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

export type ShapeDTO = {
  pt_sequence: bigint,
  pt_lat: number,
  pt_lon: number,
  dist_traveled: number,
}

class ShapesAPI extends API {
  constructor() {
    super(`${API_URL}/shape`);
  }

  async getShape(trip_id: string): Promise<Response<ShapeDTO[]>> {
    const query = `trip_id=${trip_id}`;
    return this.request('GET', 'get-shape', null, null, query);
  }
}

const api = new ShapesAPI();

export class ShapesModel {
  static async getShape(trip_id: string) {
    const res = await api.getShape(trip_id);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
