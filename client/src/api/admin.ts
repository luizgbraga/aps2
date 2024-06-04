import { API_URL } from '../config';
import { getToken } from '../utils/api';
import { API, Model } from '../utils/model';
import { Response } from './types';

type Token = string;

export type AdminDTO = {
  username: string;
  password: string;
  id: string;
};

class AdminAPI extends API {
  constructor() {
    super(`${API_URL}/admin`);
  }

  async login(username: string, password: string): Promise<Response<Token>> {
    const body = JSON.stringify({ username, password });
    return this.request('POST', 'login', null, body, null);
  }

  async me(token: Token): Promise<Response<AdminDTO>> {
    return this.request('GET', 'me', token, null, null);
  }
}

const api = new AdminAPI();

export class AdminModel extends Model<AdminDTO> {
  private constructor(dto: AdminDTO) {
    super(dto);
  }

  static async login(username: string, password: string) {
    const res = await api.login(username, password);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }

  static async me() {
    const token = getToken();
    const res = await api.me(token);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new AdminModel(res.result);
  }
}
