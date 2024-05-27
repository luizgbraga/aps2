import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

type Token = string;

class ShapesAPI extends API {
  constructor() {
    super(`${API_URL}/shape`);
  }

  async getShape(trip_id: string): Promise<Response<Token>> {
    const body = '';
    const query = `trip_id=${trip_id}`;
    return this.request('GET', '/', null, body, query);
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
