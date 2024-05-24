interface Sensor {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
}
interface ISensorRepository {
  check(latitude: number, longitude: number): Promise<number>;
}

export class FakeSensorRepository implements ISensorRepository {
  private sensors: Sensor[] = [
    { id: '1', latitude: 40.7128, longitude: -74.0060, radius: 1000 },
    { id: '2', latitude: 34.0522, longitude: -118.2437, radius: 1000 },

  ];

  async check(latitude: number, longitude: number): Promise<number> {
    return Math.random() > 0.5 ? 1 : 0;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; //raio da terra
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; //metros
    return distance;
  }
}


export class SensorRepository implements ISensorRepository {
  check(latitude: number, longitude: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
