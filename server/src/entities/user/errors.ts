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

type loginErrorCause = 'FAILED_TO_LOGIN';

export class LoginError extends Error {
  type: 'ERROR';
  cause: loginErrorCause;
  constructor(cause: loginErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}
