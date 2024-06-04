type getAffectRoutesErrorCause = 'NO ROUTES AFFECTED';

export class GetAffectRoutesError extends Error {
  type: 'ERROR';
  cause: getAffectRoutesErrorCause;
  constructor(cause: getAffectRoutesErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, GetAffectRoutesError.prototype);
  }
}

type getAffectedRoutesQueryErrorCause = "MISSING 'occurence_id' QUERY PARAMETER"

export class GetAffectedRoutesQueryError extends Error {
  type: 'ERROR';
  cause: getAffectedRoutesQueryErrorCause;
  constructor(cause: getAffectedRoutesQueryErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, GetAffectedRoutesQueryError.prototype);
  }
}

type addNewAffectErrorCause = 'AFFECT NOT ADDED';

export class AddNewAffectError extends Error {
  type: 'ERROR';
  cause: addNewAffectErrorCause;
  constructor(cause: addNewAffectErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, AddNewAffectError.prototype);
  }
}

