import { API_URL } from '../config';
import { API, Model } from '../utils/model';
import { RouteDTO, RouteModel } from './route';
import { Response } from './types';

export type MessageDTO = {
  id: string;
  text: string;
  routeId: string;
  createdAt: Date;
};

class MessageAPI extends API {
  constructor() {
    super(`${API_URL}/messages`);
  }

  async all(): Promise<Response<{ messages: MessageDTO; routes: RouteDTO}[]>> {
    return this.request('GET', 'all', null, null, null);
  }

}

const api = new MessageAPI();

export class MessageModel extends Model<MessageDTO> {
  private constructor(dto: MessageDTO) {
    super(dto);
  } 

  static async all() {
    const res = await api.all();
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result.map((dto) => ({
      message: new MessageModel(dto.messages),
      route: RouteModel.fromDTO(dto.routes),
    }));
  }

  static fromDTO(dto: MessageDTO) {
    return new MessageModel(dto);
  }

  get id() {
    return this.record.get('id');
  }

  get text() {
    return this.record.get('text');
  }

  get routeId() {
    return this.record.get('routeId');
  }

  get createdAt() {
    return this.record.get('createdAt');
  }
}
