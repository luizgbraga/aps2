type findErrorCause = 'USER_NOT_FOUND';

export class FindError extends Error {
  type: 'ERROR';
  cause: findErrorCause;
  constructor(cause: findErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, FindError.prototype);
  }
}
