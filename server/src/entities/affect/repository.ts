import 'dotenv/config';
import { affect } from './schema';
import { db } from '../../database';
import { AddNewAffectError, GetAffectRoutesError } from './errors';
import { eq, sql } from 'drizzle-orm';
import { shapes } from '../shape/schema';
import { trips } from '../trip/schema';
import { TripRepository } from '../../entities/trip/repository';
import { ShapeRepository } from '../../entities/shape/repository';
import { RouteRepository } from '../../entities/route/repository';

export const EARTH_RADIUS = 6374895;
const WAYPOINTS_NUM = 2;
type Point = [number, number];

function rotate(v: Point, arc: number): Point {
  const cosRad = Math.cos(arc);
  const sinRad = Math.sin(arc);
  const [x, y] = v;
  const xNew = x * cosRad - y * sinRad;
  const yNew = x * sinRad + y * cosRad;
  return [xNew, yNew];
}

function dotProduct(vector1: Point, vector2: Point): number {
  return vector1[0] * vector2[0] + vector1[1] * vector2[1];
}

function crossProductZ(origin: Point, destination: Point): number {
  return origin[0] * destination[1] - origin[1] * destination[0];
}

function calculateArc(vector1: Point, vector2: Point, num: number): number {
  const dot = dotProduct(vector1, vector2);
  const cross = crossProductZ(vector1, vector2);
  return (Math.abs(Math.atan2(cross, dot)) * cross) / Math.abs(cross) / num;
}

function calculateWaypoints(
  origin: Point,
  destination: Point,
  center: Point,
  num: number,
): Point[] {
  const waypoints: Point[] = [];
  const v1: Point = [origin[0] - center[0], origin[1] - center[1]];
  const v2: Point = [destination[0] - center[0], destination[1] - center[1]];
  const arc = calculateArc(v1, v2, num);
  let v: Point = rotate(v1, arc);
  for (let index = 0; index < num; index++) {
    const waypoint: Point = [center[0] + v[0], center[1] + v[1]];
    waypoints.push(waypoint);
    v = rotate(v, arc);
  }
  return waypoints;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateDistance(point1: Point, point2: Point): number {
  const lat1Rad = degreesToRadians(point1[0]);
  const lon1Rad = degreesToRadians(point1[1]);
  const lat2Rad = degreesToRadians(point2[0]);
  const lon2Rad = degreesToRadians(point2[1]);

  return (
    EARTH_RADIUS *
    Math.acos(
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad) +
        Math.sin(lat1Rad) * Math.sin(lat2Rad),
    )
  );
}

function calculateBorderPoints(shape: Point[], center: Point, radius: number) {
  let pairs: [Point, Point][] = [];
  let left: number = 0;
  let right: number = 0;
  for (let index = 0; index < shape.length; index++) {
    const dist = calculateDistance(shape[index], center);
    if (dist > radius) {
      if (left == right) {
        left++;
        right++;
        continue;
      }
      pairs.push([shape[left - 1], shape[right]]);
      continue;
    }
    if (index == 0 || index == shape.length - 1) return [];
    right++;
  }
  return pairs;
}

export class AffectRepository {
  static getAffectedRoutes = async (occurence_id: string) => {
    try {
      const result = await db
        .select({ route_id: affect.route_id })
        .from(affect)
        .where(eq(affect.occurence_id, occurence_id));
      //   if (result.length === 0) {
      //     throw new GetAffectRoutesError('NO ROUTES AFFECTED');
      //   }
      return result;
    } catch (error) {
      throw error;
    }
  };
  static affectNewRoute = async (
    occurence_id: string,
    route_id: string,
    inactive: boolean,
  ) => {
    try {
      const result = await db
        .insert(affect)
        .values({
          occurence_id: occurence_id,
          route_id: route_id,
        })
        .returning();
      if (result.length === 0) {
        throw new AddNewAffectError('AFFECT NOT ADDED');
      }
      if (inactive) {
        RouteRepository.updateRouteActivity(route_id, inactive);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
  static getNewWaypointShape = async (
    origin: Point,
    destination: Point,
    waypoints: Point[],
  ) => {
    const apikey = process.env.MAPS_API_KEY;
    const requestBody = {
      origin: {
        via: true,
        vehicleStopover: false,
        sideOfRoad: false,
        location: {
          latLng: {
            latitude: origin[0],
            longitude: origin[1],
          },
        },
      },
      destination: {
        via: true,
        vehicleStopover: false,
        sideOfRoad: false,
        location: {
          latLng: {
            latitude: destination[0],
            longitude: destination[1],
          },
        },
      },
      intermediates: waypoints.map((waypoint) => ({
        via: true,
        vehicleStopover: false,
        sideOfRoad: false,
        location: {
          latLng: {
            latitude: waypoint[0],
            longitude: waypoint[1],
          },
        },
      })),
      travelMode: 'DRIVE',
      polylineEncoding: 'GEO_JSON_LINESTRING',
      computeAlternativeRoutes: true,
      units: 'METRIC',
    };

    // Define headers
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apikey,
      'X-Goog-FieldMask': 'routes.*',
    };

    try {
      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  };
  static queryAffectedRoutes = async (
    latitude: number,
    longitude: number,
    radius: number,
  ) => {
    const sq = db
      .select({ trip_id: shapes.trip_id, pt_sequence: shapes.pt_sequence })
      .from(shapes)
      .where(
        sql`(${EARTH_RADIUS} * acos(
              cos(radians(${latitude})) * cos(radians(${shapes.pt_lat})) *
              cos(radians(${shapes.pt_lon}) - radians(${longitude})) +
              sin(radians(${latitude})) * sin(radians(${shapes.pt_lat}))
          )) <= ${radius}`,
      )
      .as('sq');
    const queryResult = await db
      .selectDistinct({ route_id: trips.route_id })
      .from(trips)
      .innerJoin(sq, eq(sq.trip_id, trips.id));
    return queryResult;
  };
  static updateAffectedRoutes = async (
    occurence_id: string,
    latitude: number,
    longitude: number,
    radius: number,
  ) => {
    try {
      const queryResult = await AffectRepository.queryAffectedRoutes(
        latitude,
        longitude,
        radius,
      );
      queryResult.forEach(async (element) => {
        const trips = await TripRepository.getTrips(element.route_id);
        const center: Point = [latitude, longitude];
        trips.forEach(async (trip) => {
          const shape = await ShapeRepository.getShape(trip.id);
          const shapeArray: Point[] = shape.map((element) => {
            return [element.pt_lat, element.pt_lon];
          });
          const borderPoints = calculateBorderPoints(
            shapeArray,
            center,
            radius,
          );
          borderPoints.forEach((pair) => {
            const waypoints = calculateWaypoints(
              pair[0],
              pair[0],
              center,
              WAYPOINTS_NUM,
            );
            AffectRepository.getNewWaypointShape(pair[0], pair[1], waypoints);
          });
          AffectRepository.affectNewRoute(
            occurence_id,
            element.route_id,
            borderPoints.length === 0,
          );
        });
      });
      return queryResult;
    } catch (error) {
      throw error;
    }
  };
}
