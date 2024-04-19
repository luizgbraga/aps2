import { API_URL } from '../config';
import { API } from '../utils/model';
import { Response } from './types';

type Token = string;

class LoginAPI extends API {
  constructor() {
    super(`${API_URL}/user`);
  }

  async loginWithCpf(
    cpf: string,
    password: string
  ): Promise<Response<Token>> {
    const body = JSON.stringify({ cpf, password });
    return this.request('POST', 'login-with-cpf', null, body, null);
  }

  async register(
    username: string,
    cpf: string,
    password: string
  ): Promise<Response<Token>> {
    const body = JSON.stringify({ username, cpf, password });
    return this.request('POST', 'register', null, body, null);
  }
}

const api = new LoginAPI();

export class LoginModel {
  static async loginWithCpf(cpf: string, password: string) {
    const res = await api.loginWithCpf(cpf, password);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }

  static async register(username: string, cpf: string, password: string) {
    const res = await api.register(username, cpf, password);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return res.result;
  }
}
