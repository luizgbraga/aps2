import { RefObject, useEffect, useState } from 'react';
import { mapController } from './mapController';
import { RoutesModel } from '../api/route';
import { TripsModel } from '../api/trip';
import { ShapesModel } from '../api/shape';

async function fetchTrips(targetRouteId: string) {
  const allTrips = await TripsModel.getAllTrips();
  const filteredTrips = allTrips.filter(
    (trip) => trip.route_id === targetRouteId
  );
  return filteredTrips;
}
async function fetchTripsShapes(trips: any[]) {
  const shapePromises = trips.map((trip) => {
    return ShapesModel.getShape(trip.id);
  });
  const shapesObject = await Promise.all(shapePromises);
  const mappedShapes = shapesObject.map((shapeArray) => {
    return shapeArray.map((shape) => {
      return { lat: shape.pt_lat, lng: shape.pt_lon };
    });
  });
  return mappedShapes;
}

export const useMap = (ref: RefObject<HTMLDivElement | null>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { setup, setLocationToCurrent, addRecentralizeButton, drawPaths } =
    mapController();
  const [paths, setPaths] = useState<any[] | null>(null);

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
      const trips = await fetchTrips('O0342AAA0A');
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
