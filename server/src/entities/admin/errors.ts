type loginErrorCause = 'ADMIN_NOT_REGISTERD' | 'WRONG_PASSWORD';

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
