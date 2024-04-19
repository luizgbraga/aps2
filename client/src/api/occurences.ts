import { API_URL } from '../config';
import { getToken } from '../utils/api';
import { API, Model } from '../utils/model';
import { queryfy } from '../utils/queryfy';
import { Response } from './types';

export type OccurenceDTO = {
  id: string;
  description: string;
};

class OccurenceAPI extends API {
  constructor() {
    super(`${API_URL}/occurence`);
  }

  async create(
    token: string,
    description: string
  ): Promise<Response<OccurenceDTO>> {
    const body = JSON.stringify({ description });
    return this.request('POST', '', token, body, null);
  }

  async list(token: string): Promise<Response<OccurenceDTO[]>> {
    const query = queryfy({ });
    return this.request('GET', '', token, null, query);
  }
}

const api = new OccurenceAPI();

export class OccurenceModel extends Model<OccurenceDTO> {
  private constructor(dto: OccurenceDTO) {
    super(dto);
  }

  static async create(description: string) {
    const token = getToken();
    const res = await api.create(token, description);
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
