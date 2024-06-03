import { API_URL } from '../config';
import { getToken } from '../utils/api';
import { API, Model } from '../utils/model';
import { NeighborhoodDTO, NeighborhoodModel } from './neighborhood';
import { SensorState } from './sensor';
import { SubscriptionDTO, SubscriptionModel } from './subscription';
import { Response } from './types';

export type OccurrenceType = 'flooding' | 'landslide' | 'congestion';

export type OccurenceDTO = {
  id: string;
  type: OccurrenceType;
  latitude: string;
  longitude: string;
  neighborhoodId: string;
  description: string;
  confirmed?: boolean;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

class OccurrenceAPI extends API {
  constructor() {
    super(`${API_URL}/occurrence`);
  }

  async create(
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    neighborhoodId: string,
    description: string
  ): Promise<Response<OccurenceDTO>> {
    const body = JSON.stringify({
      type,
      latitude,
      longitude,
      neighborhoodId,
      description,
    });
    return this.request('POST', 'add', null, body, null);
  }

  async propose(
    token: string,
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    neighborhoodId: string,
    description: string
  ): Promise<Response<OccurenceDTO>> {
    const body = JSON.stringify({
      type,
      latitude,
      longitude,
      description,
      neighborhoodId,
    });
    return this.request('POST', 'propose', token, body, null);
  }

  async all(): Promise<OccurenceDTO[]> {
    const res = await this.request('GET', 'all', null, null, null);
    return res.result;
  }

  async list(token: string): Promise<
    Response<
      {
        occurences: OccurenceDTO;
        subscription: SubscriptionDTO;
        neighborhood: NeighborhoodDTO;
      }[]
    >
  > {
    return this.request('GET', 'list', token, null, null);
  }

  async listToApprove(): Promise<
    Response<{ occurences: OccurenceDTO; neighborhood: NeighborhoodDTO }[]>
  > {
    return this.request('GET', 'to-approve', null, null, null);
  }

  async listApproved(): Promise<
    Response<
      {
        occurence: OccurenceDTO;
        neighborhood: NeighborhoodDTO;
        sensor: SensorState | null;
      }[]
    >
  > {
    return this.request('GET', 'approved', null, null, null);
  }

  async countPerZone(): Promise<Response<{ zone: string; count: number }[]>> {
    return this.request('GET', 'count-per-zone', null, null, null);
  }

  async countPerNeighborhood(): Promise<
    Response<{ neighborhood: string; count: number }[]>
  > {
    return this.request('GET', 'count-per-neighborhood', null, null, null);
  }

  async countPerType(): Promise<Response<{ type: string; count: number }[]>> {
    return this.request('GET', 'count-per-type', null, null, null);
  }

  async confirm(token: string, id: string): Promise<Response<OccurenceDTO>> {
    const body = JSON.stringify({ id });
    return this.request('PUT', 'confirm', null, body, null);
  }
}

const api = new OccurrenceAPI();

export class OccurenceModel extends Model<OccurenceDTO> {
  private constructor(dto: OccurenceDTO) {
    super(dto);
  }

  static async create(
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    neighborhoodId: string,
    description: string
  ) {
    const res = await api.create(
      type,
      latitude,
      longitude,
      neighborhoodId,
      description
    );
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new OccurenceModel(res.result);
  }

  static async propose(
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    neighborhoodId: string,
    description: string
  ) {
    const token = getToken();
    const res = await api.propose(
      token,
      type,
      latitude,
      longitude,
      neighborhoodId,
      description
    );
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new OccurenceModel(res.result);
  }

  static async all() {
    const res = await api.all();
    return res.map((dto) => new OccurenceModel(dto));
  }

  static async list() {
    const token = getToken();
    const res = await api.list(token);
    if (res.type === 'ERROR') throw new Error(res.cause);
    console.log(res.result);
    return {
      occurences: res.result.map((dto) => ({
        occurence: new OccurenceModel(dto.occurences),
        subscription: SubscriptionModel.fromDTO(dto.subscription),
        neighborhood: NeighborhoodModel.fromDTO(dto.neighborhood),
      })),
      unread: 1,
    };
  }

  static async listToApprove() {
    const res = await api.listToApprove();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => ({
      occurence: new OccurenceModel(dto.occurences),
      neighborhood: NeighborhoodModel.fromDTO(dto.neighborhood),
    }));
  }

  static async listApproved() {
    const res = await api.listApproved();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => ({
      occurence: new OccurenceModel(dto.occurence),
      neighborhood: NeighborhoodModel.fromDTO(dto.neighborhood),
      sensor: dto.sensor,
    }));
  }

  static async countPerZone() {
    const res = await api.countPerZone();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }

  static async countPerNeighborhood() {
    const res = await api.countPerNeighborhood();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }

  static async countPerType() {
    const res = await api.countPerType();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }

  static async confirm(id: string) {
    const token = getToken();
    const res = await api.confirm(token, id);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new OccurenceModel(res.result);
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

  get latitude() {
    return this.record.get('latitude');
  }

  get longitude() {
    return this.record.get('longitude');
  }

  get neighborhoodId() {
    return this.record.get('neighborhoodId');
  }

  get confirmed() {
    return this.record.get('confirmed');
  }

  get createdAt() {
    return this.record.get('createdAt');
  }

  get updatedAt() {
    return this.record.get('updatedAt');
  }

  get type() {
    return this.record.get('type');
  }

  set description(description: string) {
    this.record.set('description', description);
  }
}
