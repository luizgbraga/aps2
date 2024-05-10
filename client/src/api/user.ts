import { getToken } from '../utils/api';
import { Response } from './types';
import { API, Model } from '../utils/model';
import { API_URL } from '../config';

export type UserDTO = {
  cpf: string;
  password: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

class UserAPI extends API {
  constructor() {
    super(`${API_URL}/user`);
  }

  async me(token: string): Promise<Response<UserDTO>> {
    return this.request('GET', 'me', token, null, null);
  }
}

const api = new UserAPI();

export class UserModel extends Model<UserDTO> {
  private constructor(dto: UserDTO) {
    super(dto);
  }

  static async me() {
    const token = getToken();
    const res = await api.me(token);
    if (res.type === 'ERROR') throw new Error(res.cause);
    return new UserModel(res.result);
  }

  static fromDTO(dto: UserDTO) {
    return new UserModel(dto);
  }

  get id() {
    return this.record.get('id');
  }

  get username() {
    return this.record.get('username');
  }

  set username(value: string) {
    this.record.set('username', value);
  }

  get cpf() {
    return this.record.get('cpf');
  }

  set cpf(value: string) {
    this.record.set('cpf', value);
  }
}
