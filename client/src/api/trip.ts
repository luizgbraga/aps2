import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

export type TripDTO = {
  id: string;
  route_id: string;
  headsign: string;
  direction: string;
}

class TripsAPI extends API {
  constructor() {
    super(`${API_URL}/trip`);
  }

  async getAllTrips(): Promise<Response<TripDTO[]>> {
    return this.request('GET', 'allTrips', null, null, null);
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
