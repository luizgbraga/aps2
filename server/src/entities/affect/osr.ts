import { EARTH_RADIUS, Point } from './repository';

const baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

const buildPolygon = (center: Point, radius: number): Point[] => {
  const dx = 0.4 * ((radius * 360) / (2 * Math.PI * EARTH_RADIUS));
  console.log('dx: ', dx);
  return [
    [center[0] - dx, center[1] + dx],
    [center[0] + dx, center[1] + dx],
    [center[0] + dx, center[1] - dx],
    [center[0] - dx, center[1] - dx],
    [center[0] - dx, center[1] + dx],
  ];
};
const invertPoint = (point: Point): number[] => [point[1], point[0]];

export const getOSRRoute = async (
  start: Point,
  end: Point,
  center: Point,
  radius: number,
): Promise<[Point[], number]> => {
  const polygon = buildPolygon(center, radius);
  const object = {
    type: 'Polygon',
    coordinates: [
      polygon.map((point) => {
        return invertPoint(point);
      }),
    ],
  };
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: process.env.OSR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [invertPoint(start), invertPoint(end)],
        options: {
          avoid_polygons: object,
        },
      }),
    });
    console.log(polygon);
    // if (!response.ok) {
    //   throw new Error(`Error fetching route: ${response.statusText}`);
    // }
    const route = await response.json();
    // console.log(JSON.stringify(route));
    const str = route.routes[0].geometry;
    return [
      decodePolyline(str).map((point): Point => [point[0], point[1]]),
      route.routes[0].summary.distance,
    ];
  } catch (error) {
    console.error('gay');
    // return [[], 9999999];
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
