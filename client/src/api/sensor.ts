import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

export type Sensor = {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
};

export type SensorState = {
  flood: number;
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

  async getAllStatuses(): Promise<Response<SensorStatus[]>> {
    return this.request('GET', '', null, null, null);
  }
}

const api = new SensorAPI();

export class SensorModel {
  static async getAllStatuses() {
    const res = await api.getAllStatuses();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
