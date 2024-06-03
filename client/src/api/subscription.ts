import { API_URL } from '../config';
import { getToken } from '../utils/api';
import { API, Model } from '../utils/model';
import { NeighborhoodDTO, NeighborhoodModel } from './neighborhood';
import { Response } from './types';

export type SubscriptionDTO = {
  userId: string;
  neighborhoodId: string;
  unread: number;
  createdAt: string;
};

class SubscriptionAPI extends API {
  constructor() {
    super(`${API_URL}/subscription`);
  }

  async subscribe(
    token: string,
    neighborhoodId: string
  ): Promise<Response<SubscriptionDTO>> {
    const body = JSON.stringify({ neighborhoodId });
    return this.request('POST', '', token, body, null);
  }

  async unsubscribe(
    token: string,
    neighborhoodId: string
  ): Promise<Response<SubscriptionDTO>> {
    const body = JSON.stringify({ neighborhoodId });
    return this.request('DELETE', '', token, body, null);
  }

  async list(token: string): Promise<Response<NeighborhoodDTO[]>> {
    return this.request('GET', '', token, null, null);
  }
}

const api = new SubscriptionAPI();

export class SubscriptionModel extends Model<SubscriptionDTO> {
  private constructor(dto: SubscriptionDTO) {
    super(dto);
  }

  static async subscribe(neighborhoodId: string) {
    const token = getToken();
    const res = await api.subscribe(token, neighborhoodId);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new SubscriptionModel(res.result);
  }

  static async unsubscribe(neighborhoodId: string) {
    const token = getToken();
    const res = await api.unsubscribe(token, neighborhoodId);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new SubscriptionModel(res.result);
  }

  static async list() {
    const token = getToken();
    const res = await api.list(token);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => NeighborhoodModel.fromDTO(dto));
  }

  static fromDTO(dto: SubscriptionDTO) {
    return new SubscriptionModel(dto);
  }

  get userId() {
    return this.record.get('userId');
  }

  get neighborhoodId() {
    return this.record.get('neighborhoodId');
  }

  get unread() {
    return this.record.get('unread');
  }

  get createdAt() {
    return this.record.get('createdAt');
  }
}
