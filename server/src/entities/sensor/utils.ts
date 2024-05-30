import { Sensor } from './schema';

export const isInsideSensor = (
  sensor: Sensor,
  latitude: number,
  longitude: number,
): boolean => {
  const R = 6371e3;
  const phi1 = latitude * (Math.PI / 180);
  const phi2 = sensor.latitude * (Math.PI / 180);
  const deltaPhi = (sensor.latitude - latitude) * (Math.PI / 180);
  const deltaLambda = (sensor.longitude - longitude) * (Math.PI / 180);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance < sensor.radius;
};
