import { RefObject, useEffect, useState } from 'react';
import { mapController } from './mapController';

export const useMap = (ref: RefObject<HTMLDivElement | null>) => {
  const coordinates = [
    { lat: -22.954910561702736, lng: -43.165966423618656 },
    { lat: -22.953051697730086, lng: -43.17171294459636 },
    { lat: -22.951450792163904, lng: -43.17499447371 },
    { lat: -22.95435355374614, lng: -43.17723481083563 },
    { lat: -22.957009719130134, lng: -43.17692137895785 },
  ];

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { setup, setLocationToCurrent, addRecentralizeButton, drawPath } =
    mapController();
  useEffect(() => {
    if (ref.current && !map) {
      setMap(setup(ref.current));
    }
    if (map) {
      setLocationToCurrent(map);
      addRecentralizeButton(map);
      mapController().drawPath(map, coordinates);
    }
  }, [map]);

  return map;
};
