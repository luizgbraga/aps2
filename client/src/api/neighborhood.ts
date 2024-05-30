import { API_URL } from '../config';
import { API, Model } from '../utils/model';
import { Response } from './types';

export type NeighborhoodDTO = {
  id: string;
  name: string;
  zone: string;
};

class NeighborhoodAPI extends API {
  constructor() {
    super(`${API_URL}/neighborhood`);
  }

  async list(): Promise<Response<NeighborhoodDTO[]>> {
    return this.request('GET', '', null, null, null);
  }
}

const api = new NeighborhoodAPI();

export class NeighborhoodModel extends Model<NeighborhoodDTO> {
  private constructor(dto: NeighborhoodDTO) {
    super(dto);
  }

  static async list() {
    const res = await api.list();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => new NeighborhoodModel(dto));
  }

  static fromDTO(dto: NeighborhoodDTO) {
    return new NeighborhoodModel(dto);
  }

  get id() {
    return this.record.get('id');
  }

  get name() {
    return this.record.get('name');
  }

  get zone() {
    return this.record.get('zone');
  }
}
