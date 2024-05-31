import { RefObject, useEffect, useRef, useState } from 'react';
import { mapController } from './mapController';
import { TripsModel } from '../api/trip';
import { ShapesModel } from '../api/shape';
import { TripDTO } from '../api/trip';
import { RoutesModel } from '../api/route';
import { useAsync } from '../utils/async';
import { OccurenceModel } from '../api/occurences';

async function fetchTrips(targetRouteId: string[]) {
  const allTrips = await TripsModel.getAllTrips();
  const allRoutes = await RoutesModel.getAllRoutes();
  const filteredTrips = allTrips.filter((trip) =>
    targetRouteId.includes(trip.route_id)
  );
  return filteredTrips.map((trip) => {
    let color = '';
    let text_color = '';
    const route = allRoutes.find((x) => x.id === trip.route_id);
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

export const useMap = (
  ref: RefObject<HTMLDivElement | null>,
  pinnable: boolean
) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const {
    setup,
    setLocationToCurrent,
    addRecentralizeButton,
    drawPaths,
    addMarker,
  } = mapController();
  const [paths, setPaths] = useState<
    {
      shape: { lat: number; lng: number }[];
      color: string;
      text_color: string;
    }[]
  >([]);
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const prevMarkersRef = useRef([] as google.maps.Marker[]);
  const { result: allOccurences } = useAsync(() => OccurenceModel.all());

  const changeRouteIds = (newRouteIds: string[]) => {
    setRouteIds(newRouteIds);
  };

  map?.addListener('click', (e: any) => {
    if (!pinnable) return;
    const m = addMarker(
      map,
      { lat: e.latLng.lat(), lng: e.latLng.lng() },
      true
    );
    clearMarkers(prevMarkersRef.current);
    if (m) {
      prevMarkersRef.current.push(m);
    }
  });

  useEffect(() => {
    if (ref.current && !map) {
      setMap(setup(ref.current));
    }
    if (map) {
      if (prevMarkersRef.current.length && pinnable) return;
      setLocationToCurrent(map);
      addRecentralizeButton(map);
      if (allOccurences && !pinnable) {
        allOccurences.forEach((occurence) => {
          const m = addMarker(map, {
            lat: parseFloat(occurence.latitude),
            lng: parseFloat(occurence.longitude),
          });
          if (m) {
            prevMarkersRef.current.push(m);
          }
        });
      }
    }
  }, [
    addRecentralizeButton,
    map,
    ref,
    setLocationToCurrent,
    setup,
    pinnable,
    allOccurences,
    addMarker,
  ]);

  useEffect(() => {
    const fetchTripsAndShapes = async () => {
      const trips = await fetchTrips(routeIds);
      const paths = await fetchTripsShapes(trips);
      setPaths(paths);
    };
    fetchTripsAndShapes();
  }, [map, routeIds]);

  useEffect(() => {
    if (map && paths) drawPaths(map, paths);
  }, [drawPaths, map, paths]);

  function clearMarkers(markers: google.maps.Marker[]) {
    for (const m of markers) {
      m.setMap(null);
    }
  }

  return {
    map,
    changeRouteIds,
    routeIds,
    prevMarkersRef,
  };
};
