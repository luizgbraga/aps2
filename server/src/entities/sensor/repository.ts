interface Sensor {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
}
interface ISensorRepository {
  check(latitude: number, longitude: number): Promise<Sensor>;
}

export class FakeSensorRepository implements ISensorRepository {
  check(latitude: number, longitude: number): Promise<Sensor> {
    throw new Error('Method not implemented.');
  }
}

export class SensorRepository implements ISensorRepository {
  check(latitude: number, longitude: number): Promise<Sensor> {
    throw new Error('Method not implemented.');
  }
}
