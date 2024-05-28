import { RefObject, useEffect, useState } from 'react';
import { mapController } from './mapController';
import { TripsModel } from '../api/trip';
import { ShapesModel } from '../api/shape';
import { TripDTO } from '../api/trip';
import { ShapeDTO } from '../api/shape';
import allRoutes from '../../dist/allRoutes.json';

async function fetchTrips(targetRouteId: string[]) {
  const allTrips = await TripsModel.getAllTrips();
  const filteredTrips = allTrips.filter((trip) =>
    targetRouteId.includes(trip.route_id)
  );
  return filteredTrips.map((trip) => {
    let color = '';
    let text_color = '';
    const route = allRoutes.result.find((x) => x.id === trip.route_id);
    if (route) {
      color = '#' + route.color;
      if (route.text_color) text_color = route.text_color;
    }
    return { trip: trip, color: color, text_color: text_color };
  });
}

async function fetchTripsShapes(
  trips: { trip: TripDTO; color: string; text_color: string }[]
) {
  const shapePromises = trips.map(async (element) => {
    const shape = await ShapesModel.getShape(element.trip.id);
    return {
      shape: shape,
      color: element.color,
      text_color: element.text_color,
    };
  });
  const shapesObject = await Promise.all(shapePromises);
  const mappedShapes = shapesObject.map((shapeObject) => {
    return {
      shape: shapeObject.shape.map((shape) => {
        return { lat: shape.pt_lat, lng: shape.pt_lon };
      }),
      color: shapeObject.color,
      text_color: shapeObject.color,
    };
  });
  return mappedShapes;
}

let routeids = [];
routeids.push('O0342AAA0A');
routeids.push('O0636AAA0A');

export const useMap = (ref: RefObject<HTMLDivElement | null>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { setup, setLocationToCurrent, addRecentralizeButton, drawPaths } =
    mapController();
  const [paths, setPaths] = useState<
    {
      shape: { lat: number; lng: number }[];
      color: string;
      text_color: string;
    }[]
  >([]);

  const handlePathClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const clickedLatLng = event.latLng;
      console.log('Coordinates:', clickedLatLng.toString());
      // Run your custom code here with the clickedLatLng coordinates
    }
  };
  useEffect(() => {
    if (ref.current && !map) {
      setMap(setup(ref.current));
    }
    if (map) {
      setLocationToCurrent(map);
      addRecentralizeButton(map);
    }
  }, [map]);

  useEffect(() => {
    const fetchTripsAndShapes = async () => {
      const trips = await fetchTrips(routeids);
      const paths = await fetchTripsShapes(trips);
      setPaths(paths);
    };
    fetchTripsAndShapes();
  }, [map]);

  useEffect(() => {
    if (map && paths) drawPaths(map, paths, handlePathClick);
  }, [paths]);

  return map;
};
