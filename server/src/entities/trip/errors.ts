type getAllTripsErrorCause = 'NO TRIPS REGISTERED';

export class GetAllTripsError extends Error {
  type: 'ERROR';
  cause: getAllTripsErrorCause;
  constructor(cause: getAllTripsErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, GetAllTripsError.prototype);
  }
}

type addNewTripErrorCause = 'TRIP NOT ADDED';

export class AddNewTripError extends Error {
  type: 'ERROR';
  cause: addNewTripErrorCause;
  constructor(cause: addNewTripErrorCause) {
    super();
    this.cause = cause;
    this.type = 'ERROR';
    Object.setPrototypeOf(this, AddNewTripError.prototype);
  }
}
