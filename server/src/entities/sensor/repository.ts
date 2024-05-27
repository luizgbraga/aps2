import { Sensor } from './schema';
import { haversineDistance } from './utils';

export interface ISensorRepository {
  check(latitude: number, longitude: number): Promise<Sensor | null>;
}

export class FakeSensorRepository implements ISensorRepository {
  private sensors: Sensor[] = [
    { id: '1', latitude: -22.9068, longitude: -43.1729, radius: 2000, flood: true, landslide: false, congestion: true }, // Centro
    { id: '2', latitude: -22.9133, longitude: -43.2096, radius: 1500, flood: false, landslide: true, congestion: false }, // Botafogo
    { id: '3', latitude: -22.9711, longitude: -43.1860, radius: 1000, flood: true, landslide: true, congestion: false },  // Copacabana
    { id: '4', latitude: -22.9868, longitude: -43.2065, radius: 1000, flood: false, landslide: false, congestion: true }, // Ipanema
    { id: '5', latitude: -22.9049, longitude: -43.2350, radius: 2500, flood: true, landslide: false, congestion: true },  // Maracanã
    { id: '6', latitude: -22.9035, longitude: -43.1780, radius: 1500, flood: false, landslide: true, congestion: true },  // Lapa
    { id: '7', latitude: -22.9519, longitude: -43.2105, radius: 2000, flood: true, landslide: true, congestion: true },   // Leblon
    { id: '8', latitude: -22.9674, longitude: -43.2587, radius: 1000, flood: false, landslide: false, congestion: false },// Jardim Botânico
    { id: '9', latitude: -22.8876, longitude: -43.2775, radius: 3000, flood: true, landslide: false, congestion: true },  // Barra da Tijuca
    // Áreas propositalmente vazias
    // Área 1: entre Botafogo e Copacabana
    // Área 2: entre Ipanema e Jardim Botânico
    // Área 3: ao norte do Maracanã
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
        return sensor; // Sensor cobre a região
      }
    }
    return null; // Nenhum sensor cobre a região
  }
}
