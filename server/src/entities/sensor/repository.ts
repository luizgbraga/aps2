import { Sensor } from './schema';
import { haversineDistance } from './utils';

export interface ISensorRepository {
  check(latitude: number, longitude: number): Promise<Sensor | null>;
}

interface SensorState {
  flood: boolean;
  landslide: boolean;
  congestion: boolean;
  lastUpdated: number;
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

  private sensorStates: { [id: string]: SensorState } = {};

  constructor() {
    // Initialize sensor states with current time
    const currentTime = Date.now();
    this.sensors.forEach(sensor => {
      this.sensorStates[sensor.id] = {
        flood: sensor.flood,
        landslide: sensor.landslide,
        congestion: sensor.congestion,
        lastUpdated: currentTime
      };
    });
  }

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
    const state = this.sensorStates[sensor.id];
    const currentTime = Date.now();
    const timeElapsed = currentTime - state.lastUpdated;

    const floodThreshold = 3 * 60 * 60 * 1000; // 4 hours in milliseconds
    const landslideThreshold = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    const congestionThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (timeElapsed > floodThreshold) {
      state.flood = this.randomizeState(sensor, state.flood, 0.1, currentTime, 'flood');
    }

    if (timeElapsed > landslideThreshold) {
      state.landslide = this.randomizeState(sensor, state.landslide, 0.05, currentTime, 'landslide');
    }

    if (timeElapsed > congestionThreshold) {
      state.congestion = this.randomizeState(sensor, state.congestion, 0.15, currentTime, 'congestion');
    }

    return {
      ...sensor,
      flood: state.flood,
      landslide: state.landslide,
      congestion: state.congestion,
    };
  }

  private randomizeState(sensor: Sensor, currentState: boolean, baseProbability: number, currentTime: number, stateType: string): boolean {
    const currentHour = new Date().getHours();
    const regionInfluence = this.getRegionInfluence(sensor.latitude, sensor.longitude);
    const randomEventImpact = this.getRandomEventImpact(stateType);

    // Base probability of state change
    let probability = baseProbability;

    // Increase probability of state change during rush hours for congestion only
    if (stateType === 'congestion' && (currentHour >= 7 && currentHour <= 9 || currentHour >= 17 && currentHour <= 19)) {
      probability += 0.2;
    }

    // Add regional influence
    probability += regionInfluence;

    // Add random event influence
    if (randomEventImpact) {
      probability += 0.3;
    }

    // Update the lastUpdated timestamp if state changes
    const newState = Math.random() < probability ? !currentState : currentState;
    if (newState !== currentState) {
      this.sensorStates[sensor.id].lastUpdated = currentTime;
    }

    return newState;
  }

  private getRegionInfluence(latitude: number, longitude: number): number {
    // Simulate different influences based on region
    if (latitude < -22.95 && longitude < -43.18) {
      return 0.1;
    }

    if (latitude > -22.94 && longitude < -43.15) {
      return 0.05;
    }

    return 0.0;
  }

  private getRandomEventImpact(stateType: string): boolean {
    switch (stateType) {
      case 'flood':
        return Math.random() < 0.02; // 2% chance of a random flood event
      case 'landslide':
        return Math.random() < 0.005; // 0.5% chance of a random landslide event
      case 'congestion':
        return Math.random() < 0.1; // 10% chance of a random congestion event
      default:
        return false;
    }
  }
}
