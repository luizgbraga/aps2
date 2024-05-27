import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

type Token = string;

class TripsAPI extends API {
  constructor() {
    super(`${API_URL}/trips`);
  }

  async getAllTrips(): Promise<Response<Token>> {
    const body = '';
    return this.request('GET', '/allTrips', null, body, null);
  }
}

const api = new TripsAPI();

export class TripsModel {
  static async getAllTrips() {
    const res = await api.getAllTrips();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
