export type Response<T> =
  | {
      type: 'SUCCESS';
      result: T;
    }
  | {
      type: 'ERROR';
      cause: string;
    };
