import { describe, expect, it } from '@jest/globals';
import { Point, EARTH_RADIUS } from './repository';
const baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
const apiKey = '5b3ce3597851110001cf624835fd24f66d184d2bb6b795b915985512';

// Entrada pro API é [lng, lat]
const start: Point = [-43.1669676, -22.9546407];
const end: Point = [-43.1760094, -22.9661137];
const occurrenceCenter: Point = [-43.1764841, -22.9595605];
const radiusFromCenter = 200;
const getOSRRoute = async (start: Point, end: Point, center: Point, radius: number) => {
  const polygonToAvoid = buildPolygon(center, radius);
  const avoidPolygonObject = {
    type: 'Polygon',
    coordinates: [
      polygonToAvoid.map((point) => {
        return point;
      }),
    ],
  };
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [start, end],
        options: {
          avoid_polygons: avoidPolygonObject,
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching route: ${response.statusText}`);
    }
    // console.log(route.routes);
    const route = await response.json();
    const encodedPathStr = route.routes[0].geometry;
    return [decodePolyline(encodedPathStr).map((point): Point => [point[0], point[1]]), route.routes[0].summary.distance];
  } catch (error) {
    console.error('gay:', error);
  }
};

function decodePolyline(encoded: any) {
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates = [];

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lat * 1e-5, lng * 1e-5]);
  }

  return coordinates;
}
const buildPolygon = (center: Point, radius: number): Point[] => {
  const dx = 0.4 * ((radius * 360) / (2 * Math.PI * EARTH_RADIUS));
  return [
    [center[0] - dx, center[1] + dx],
    [center[0] + dx, center[1] + dx],
    [center[0] + dx, center[1] - dx],
    [center[0] - dx, center[1] - dx],
    [center[0] - dx, center[1] + dx],
  ];
};
const invertPoint = (point: Point): number[] => [point[1], point[0]];

// "MAIN"
describe('test', () => {
  (async () => {
    let [res1, res2] = await getOSRRoute(start, end, occurrenceCenter, radiusFromCenter);
    // Execute código que depende de res1 e res2 AQUI DENTRO
  })();
});
