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

type loginErrorCause = 'USER_NOT_REGISTERD' | 'WRONG_PASSWORD' | 'INVALID_CPF';

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

type RegisterErrorCause =
  | 'USER_ALREADY_EXISTS'
  | 'INVALID_CPF'
  | 'INVALID_PASSWORD';

export class RegisterError extends Error {
  type: 'ERROR';
  cause: RegisterErrorCause;
  constructor(cause: RegisterErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, RegisterError.prototype);
  }
}
