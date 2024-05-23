import { RefObject, useEffect, useState } from 'react';
import { mapController } from './mapController';

export const useMap = (ref: RefObject<HTMLDivElement | null>) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { setup, setLocationToCurrent, addRecentralizeButton } =
    mapController();
  useEffect(() => {
    if (ref.current && !map) {
      setMap(setup(ref.current));
    }
    if (map) {
      setLocationToCurrent(map);
      addRecentralizeButton(map);
    }
  }, [map]);

  return map;
};
