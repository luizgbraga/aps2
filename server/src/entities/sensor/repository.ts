import { Sensor } from './schema';
import { haversineDistance } from './utils';

export interface ISensorRepository {
  check(latitude: number, longitude: number): Promise<Sensor | null>;
}

export class FakeSensorRepository implements ISensorRepository {
  private sensors: Sensor[] = [
    { id: '1', latitude: -22.9068, longitude: -43.1729, radius: 2000, flood: true, landslide: false, congestion: true },
    { id: '2', latitude: -22.9133, longitude: -43.2096, radius: 1500, flood: false, landslide: true, congestion: false },
    { id: '3', latitude: -22.9711, longitude: -43.1860, radius: 1000, flood: true, landslide: true, congestion: false },
    { id: '4', latitude: -22.9868, longitude: -43.2065, radius: 1000, flood: false, landslide: false, congestion: true },
    { id: '5', latitude: -22.9049, longitude: -43.2350, radius: 2500, flood: true, landslide: false, congestion: true },
    { id: '6', latitude: -22.9035, longitude: -43.1780, radius: 1500, flood: false, landslide: true, congestion: true },
    { id: '7', latitude: -22.9519, longitude: -43.2105, radius: 2000, flood: true, landslide: true, congestion: true },
    { id: '8', latitude: -22.9674, longitude: -43.2587, radius: 1000, flood: false, landslide: false, congestion: false },
    { id: '9', latitude: -22.8876, longitude: -43.2775, radius: 3000, flood: true, landslide: false, congestion: true },
  ];

  async check(latitude: number, longitude: number): Promise<Sensor | null> {
    for (const sensor of this.sensors) {
      const distance = haversineDistance(
        latitude,
        longitude,
        sensor.latitude,
        sensor.longitude
      );
      if (distance <= sensor.radius) {
        return this.simulateSensorData(sensor);
      }
    }
    return null;
  }

  private simulateSensorData(sensor: Sensor): Sensor {
    const currentHour = new Date().getHours();
    const regionInfluence = this.getRegionInfluence(sensor.latitude, sensor.longitude);
    const randomEventImpact = this.getRandomEventImpact();

    return {
      ...sensor,
      flood: this.randomizeState(sensor.flood, currentHour, regionInfluence.flood, randomEventImpact.flood),
      landslide: this.randomizeState(sensor.landslide, currentHour, regionInfluence.landslide, randomEventImpact.landslide),
      congestion: this.randomizeState(sensor.congestion, currentHour, regionInfluence.congestion, randomEventImpact.congestion),
    };
  }

  private randomizeState(currentState: boolean, hour: number, regionInfluence: number, randomEvent: boolean): boolean {
    // Base probability of state change
    let probability = 0.1;

    // Increase probability of state change during rush hours
    if (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19) {
      probability += 0.2;
    }

    // Add regional influence
    probability += regionInfluence;

    // Add random event influence
    if (randomEvent) {
      probability += 0.3;
    }

    return Math.random() < probability ? !currentState : currentState;
  }

  private getRegionInfluence(latitude: number, longitude: number): { flood: number, landslide: number, congestion: number } {
    // Simulate different influences based on region
    if (latitude < -22.95 && longitude < -43.18) {
      return { flood: 0.1, landslide: 0.0, congestion: 0.2 };
    }

    if (latitude > -22.94 && longitude < -43.15) {
      return { flood: 0.05, landslide: 0.1, congestion: 0.15 };
    }

    return { flood: 0.0, landslide: 0.0, congestion: 0.0 };
  }

  private getRandomEventImpact(): { flood: boolean, landslide: boolean, congestion: boolean } {
    const floodEvent = Math.random() < 0.05;
    const landslideEvent = Math.random() < 0.03;
    const congestionEvent = Math.random() < 0.1;
    return { flood: floodEvent, landslide: landslideEvent, congestion: congestionEvent };
  }
}
