import { sensors } from './fake';
import { FakeSensor, HourRange, SensorState, SensorStatus } from './schema';
import { isInsideSensor } from './utils';

export interface ISensorRepository {
  check(latitude: number, longitude: number): Promise<SensorState | null>;
  getAllStatuses(): Promise<SensorStatus[]>;
}

export class FakeSensorRepository implements ISensorRepository {
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

  private simulateSensorData(sensor: FakeSensor): SensorState {
    const currentHour = new Date().getHours();
    const flood = this.getIntensity(sensor.floodingInterval);
    const landslide = this.getIntensity(sensor.landslideInterval);
    const congestion = this.getIntensity(sensor.congestionInterval);
    return { flood, landslide, congestion };
  }

  private getIntensity(range: HourRange) {
    const currentHour = new Date().getHours();
    if (currentHour < range.start || currentHour > range.end) return 0;
    return (currentHour - range.start) / (range.end - range.start);
  }
}
