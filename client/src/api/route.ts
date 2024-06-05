import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';
import { Model } from '../utils/model';

export type RouteDTO = {
  id: string;
  short_name: string;
  long_name: string;
  desc_name: string;
  type: string;
  color: string;
  text_color?: string;
  inactive: boolean;
};

class RouteAPI extends API {
  constructor() {
    super(`${API_URL}/route`);
  }

  async getAllRoutes(): Promise<Response<RouteDTO[]>> {
    return this.request('GET', '/allRoutes', null, null, null);
  }
}

const api = new RouteAPI();

export class RouteModel extends Model<RouteDTO>{
  private constructor(dto: RouteDTO) {
    super(dto);
  }

  static async getAllRoutes() {
    const res = await api.getAllRoutes();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }

  static fromDTO(dto: RouteDTO) {
    return new RouteModel(dto);
  }

  get id() {
    return this.record.get('id');
  }

  get short_name() {
    return this.record.get('short_name');
  }
  
  get long_name() {
    return this.record.get('long_name');
  }
  
  get desc_name() {
    return this.record.get('desc_name');
  }

  get type() {
    return this.record.get('type');
  }

  get color() {
    return this.record.get('color');
  }

  get text_color() {
    return this.record.get('text_color');
  }
}
