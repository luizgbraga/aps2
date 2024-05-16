import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

type Token = string;

class AdminLoginAPI extends API {
  constructor() {
    super(`${API_URL}/admin`);
  }

  async login(username: string, password: string): Promise<Response<Token>> {
    const body = JSON.stringify({ username, password });
    return this.request('POST', 'login', null, body, null);
  }
}

const api = new AdminLoginAPI();

export class AdminLoginModel {
  static async login(username: string, password: string) {
    const res = await api.login(username, password);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
