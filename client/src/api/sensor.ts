import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

class SensorAPI extends API {
  constructor() {
    super(`${API_URL}/sensor`);
  }

  async check(latitude: number, longitude: number): Promise<Response<number>> {
    const body = JSON.stringify({ latitude, longitude});
    return this.request('POST', 'status', null, body, null);
  }
}

const api = new SensorAPI();

export class SensorModel {
  static async check(latitude: number, longitude: number) {
    const res = await api.check(latitude, longitude);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
