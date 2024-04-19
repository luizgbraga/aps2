import { Record } from './record';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Headers = {
  'Content-Type': string;
  Authorization?: string;
};

export abstract class API {
  protected route;
  constructor(route: string) {
    this.route = route;
  }

  protected async request(
    method: Method,
    path: string,
    token: string | null,
    body: string | null,
    query: string | null
  ) {
    const qp = query ? `?${query}` : '';
    const headers: Headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
    };
    const res = await fetch(`${this.route}/${path}${qp}`, {
      method,
      headers,
      body,
    });
    if (!res.ok && res.status !== 500) {
      throw new Error('Unexpected error occurred.');
    }
    return res.json();
  }
}

export abstract class Model<T> {
  protected record: Record<T>;
  constructor(dto: T) {
    this.record = new Record(dto);
  }

  hasChanges(key?: keyof T) {
    return this.record.hasChanges(key);
  }

  toDTO(): T {
    return this.record.initial;
  }

  updateRecord(dto: T) {
    this.record = new Record(dto);
  }

  copy() {
    const dto = this.toDTO();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.constructor as any)(dto);
  }

  get changes(): Partial<T> {
    return this.record.changed;
  }
}
