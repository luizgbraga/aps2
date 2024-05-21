import { API_URL } from '../config';
import { getToken } from '../utils/api';
import { API, Model } from '../utils/model';
import { queryfy } from '../utils/queryfy';
import { Response } from './types';

export type OccurenceDTO = {
  id: string;
  latitude: string;
  longitude: string;
  description: string;
};

export type OccurenceType = 'flooding' | 'landslide';

class OccurrenceAPI extends API {
  constructor() {
    super(`${API_URL}/occurrence`);
  }

  async create(
    token: string,
    type: OccurenceType,
    latitude: string,
    longitude: string,
    description: string
  ): Promise<Response<OccurenceDTO>> {
    const body = JSON.stringify({ type, latitude, longitude, description });
    return this.request('POST', '', token, body, null);
  }

  async list(token: string): Promise<Response<OccurenceDTO[]>> {
    const query = queryfy({});
    return this.request('GET', '', token, null, query);
  }
}

const api = new OccurrenceAPI();

export class OccurenceModel extends Model<OccurenceDTO> {
  private constructor(dto: OccurenceDTO) {
    super(dto);
  }

  static async create(
    type: OccurenceType,
    latitude: string,
    longitude: string,
    description: string
  ) {
    const token = getToken();
    const res = await api.create(token, type, latitude, longitude, description);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new OccurenceModel(res.result);
  }

  static async list() {
    const token = getToken();
    const res = await api.list(token);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => new OccurenceModel(dto));
  }

  static fromDTO(dto: OccurenceDTO) {
    return new OccurenceModel(dto);
  }

  get id() {
    return this.record.get('id');
  }

  get description() {
    return this.record.get('description');
  }

  set description(description: string) {
    this.record.set('description', description);
  }
}
