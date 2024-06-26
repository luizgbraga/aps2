import { RefObject, useEffect, useRef, useState } from 'react';
import { mapController } from './mapController';
import { TripsModel } from '../api/trip';
import { ShapesModel } from '../api/shape';
import { TripDTO } from '../api/trip';
import { RouteDTO, RouteModel } from '../api/route';
import { useAsync } from '../utils/async';
import { OccurrenceModel } from '../api/occurrences';
import { SensorModel } from '../api/sensor';

async function fetchTrips(targetRouteId: string[]) {
  if (!allTrips) return;
  const filteredTrips = allTrips.filter((trip) => targetRouteId.includes(trip.route_id));
  return filteredTrips.map((trip) => {
    let color = '';
    let text_color = '';
    let inactive = false;
    const route = allRoutes.find((x) => x.id === trip.route_id);
    if (route) {
      inactive = route.inactive;
      color = '#' + route.color;
      if (route.text_color) text_color = route.text_color;
    }
    return {
      route_id: route?.id,
      trip: trip,
      inactive: inactive,
      color: color,
      text_color: text_color,
    };
  });
}

async function fetchTripsShapes(
  trips:
    | {
        route_id: string | undefined;
        trip: TripDTO;
        inactive: boolean;
        color: string;
        text_color: string;
      }[]
    | undefined
) {
  if (!trips) return;
  const shapePromises = trips.map(async (element) => {
    const shape = await ShapesModel.getShape(element.trip.id);
    return {
      route_id: element.route_id,
      shape: shape,
      inactive: element.inactive,
      color: element.color,
      text_color: element.text_color,
    };
  });
  const shapesObject = await Promise.all(shapePromises);
  const mappedShapes = shapesObject.map((shapeObject) => {
    return {
      route_id: shapeObject.route_id,
      shape: shapeObject.shape.map((shape) => {
        return { lat: shape.pt_lat, lng: shape.pt_lon };
      }),
      inactive: shapeObject.inactive,
      color: shapeObject.color,
      text_color: shapeObject.color,
    };
  });
  return mappedShapes;
}

let allRoutes: RouteDTO[];
let allTrips: TripDTO[];
async function loadTripsAndRoutes() {
  let routeRes = await RouteModel.getAllRoutes();
  let tripRes = await TripsModel.getAllTrips();
  allRoutes = routeRes;
  allTrips = tripRes;
}

export const useMap = (ref: RefObject<HTMLDivElement | null>, pinnable: boolean, admin?: boolean) => {
  const { setup, setLocationToCurrent, addRecentralizeButton, drawPaths, addMarker, clearPaths } = mapController();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [paths, setPaths] = useState<
    {
      route_id: string | undefined;
      shape: { lat: number; lng: number }[];
      inactive: boolean;
      color: string;
      text_color: string;
    }[] | undefined
  >([]);
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [routeIdsToDraw, setRouteIdsToDraw] = useState<string[]>([]);
  const [polylines, setPolylines] = useState<{ route_id: string; polyline: google.maps.Polyline }[]>([]);
  const prevMarkersRef = useRef([] as google.maps.Marker[]);
  const { result: allOccurrences } = useAsync(() => OccurrenceModel.all());
  const { result: allSensors } = useAsync(() => SensorModel.list());

  useEffect(() => {
    loadTripsAndRoutes();
  });

  map?.addListener('click', (e: any) => {
    if (!pinnable) return;
    const m = addMarker(map, { lat: e.latLng.lat(), lng: e.latLng.lng() }, true);
    clearMarkers(prevMarkersRef.current);
    if (m) prevMarkersRef.current.push(m);
  });

  useEffect(() => {
    if (ref.current && !map) setMap(setup(ref.current));
    if (!map) return;
    if (prevMarkersRef.current.length && pinnable) return;
    setLocationToCurrent(map);
    addRecentralizeButton(map);
    if (allOccurrences && !pinnable) {
      allOccurrences.forEach((occurrence) => {
        const m = addMarker(map, {
          lat: parseFloat(occurrence.latitude),
          lng: parseFloat(occurrence.longitude),
        });
        if (m) prevMarkersRef.current.push(m);
      });
    }
  }, [map, ref, pinnable, allOccurrences, setup, setLocationToCurrent, addRecentralizeButton, addMarker]);

  function clearMarkers(markers: google.maps.Marker[]) {
    for (const m of markers) m.setMap(null);
  }

  // changeRouteIds is called when the user updates the filter. It (and the following useEffects) draws the newly selected lines and removes any that were removed
  const changeRouteIds = (newRouteIds: string[]) => {
    const addedRoutes = newRouteIds.filter((route) => !routeIds.includes(route));
    const removedRoutes = routeIds.filter((route) => !newRouteIds.includes(route));
    const polylinesToRemove = polylines.filter((polyline) => removedRoutes.includes(polyline.route_id));
    setRouteIds(newRouteIds);
    setRouteIdsToDraw(addedRoutes);
    clearPaths(polylinesToRemove);
  };

  useEffect(() => {
    const fetchTripsAndShapes = async () => {
      const trips = await fetchTrips(routeIdsToDraw);
      const paths = await fetchTripsShapes(trips);
      setPaths(paths);
    };
    fetchTripsAndShapes();
  }, [routeIdsToDraw]);

  useEffect(() => {
    if (map && paths) drawPaths(map, paths, setPolylines);
  }, [paths]);
  return {
    map,
    changeRouteIds,
    routeIds,
    prevMarkersRef,
  };
};
