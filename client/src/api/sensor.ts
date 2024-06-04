import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

export type Sensor = {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  neighborhoodId: string;
};

export type SensorState = {
  flooding: number;
  landslide: number;
  congestion: number;
};

export type SensorStatus = {
  sensor: Sensor;
  state: SensorState;
};

class SensorAPI extends API {
  constructor() {
    super(`${API_URL}/sensor`);
  }

  async list(): Promise<Response<{ lat: number; lng: number }[]>> {
    return this.request('GET', '', null, null, null);
  }
}

const api = new SensorAPI();

export class SensorModel {
  static async list() {
    const res = await api.list();
    if (res.type == 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => ({
      lat: dto.lat,
      lng: dto.lng
    }));
  }
}
