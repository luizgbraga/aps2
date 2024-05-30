type getAllRoutesErrorCause = 'NO ROUTES REGISTERED';

export class GetAllRoutesError extends Error {
  type: 'ERROR';
  cause: getAllRoutesErrorCause;
  constructor(cause: getAllRoutesErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, GetAllRoutesError.prototype);
  }
}

type addNewRouteErrorCause = 'ROUTE NOT ADDED';

export class AddNewRouteError extends Error {
  type: 'ERROR';
  cause: addNewRouteErrorCause;
  constructor(cause: addNewRouteErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, AddNewRouteError.prototype);
  }
}
