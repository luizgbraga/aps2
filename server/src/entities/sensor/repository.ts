import { sensors } from './fake';
import { FakeSensor, HourRange, SensorState, SensorStatus } from './schema';
import { isInsideSensor } from './utils';

export interface ISensorRepository {
  list(): Promise<{ lat: number; lng: number }[]>;
  check(latitude: number, longitude: number): Promise<SensorState | null>;
  getAllStatuses(): Promise<SensorStatus[]>;
  getSensorData(neighborhoodId: string): SensorState | null;
}

export class FakeSensorRepository implements ISensorRepository {
  async list(): Promise<{ lat: number; lng: number }[]> {
    return sensors.map((sensor) => ({
      lat: sensor.latitude,
      lng: sensor.longitude,
    }));
  }
  async getAllStatuses(): Promise<SensorStatus[]> {
    return sensors.map((sensor) => ({
      sensor,
      state: this.simulateSensorData(sensor),
    }));
  }

  async check(
    latitude: number,
    longitude: number,
  ): Promise<SensorState | null> {
    for (const sensor of sensors) {
      if (isInsideSensor(sensor, latitude, longitude)) {
        return this.simulateSensorData(sensor);
      }
    }
    return null;
  }

  getSensorData(neighborhoodId: string): SensorState | null {
    const sensor = sensors.find(
      (sensor) => sensor.neighborhoodId === neighborhoodId,
    );
    if (!sensor) return null;
    return this.simulateSensorData(sensor);
  }

  private simulateSensorData(sensor: FakeSensor): SensorState {
    const flooding = this.getIntensity(sensor.floodingInterval);
    const landslide = this.getIntensity(sensor.landslideInterval);
    const congestion = this.getIntensity(sensor.congestionInterval);
    return { flooding, landslide, congestion };
  }

  private getIntensity(range: HourRange) {
    const currentHour = new Date().getHours();
    if (currentHour < range.start || currentHour > range.end) return 0;
    return (currentHour - range.start) / (range.end - range.start);
  }
}
