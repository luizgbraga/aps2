type getShapeErrorCause = 'NO SHAPES REGISTERED';
type getShapeBadRequestCause = "MISSING 'trip_id' QUERY PARAMETER";

export class GetShapeBadRequestError extends Error {
  type: 'ERROR';
  cause: getShapeBadRequestCause;
  constructor(cause: getShapeBadRequestCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, GetShapeBadRequestError.prototype);
  }
}

export class GetShapeError extends Error {
  type: 'ERROR';
  cause: getShapeErrorCause;
  constructor(cause: getShapeErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, GetShapeError.prototype);
  }
}

type addNewShapeErrorCause = 'SHAPE NOT ADDED';

export class AddNewShapeError extends Error {
  type: 'ERROR';
  cause: addNewShapeErrorCause;
  constructor(cause: addNewShapeErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, AddNewShapeError.prototype);
  }
}
