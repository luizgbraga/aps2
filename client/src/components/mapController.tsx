import { renderToStaticMarkup } from 'react-dom/server';
import { RecentralizeButton } from './RecentralizeButton';

const DEFAULT_LOCATION = { lat: -22.9068, lng: -43.1729 };

export const mapController = () => {
  const setup = (ref: HTMLDivElement) => {
    const map = new window.google.maps.Map(ref, {
      center: DEFAULT_LOCATION,
      zoom: 16,
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });
    return map;
  };

  const setLocationToCurrent = (map: google.maps.Map) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.setCenter({ lat: latitude, lng: longitude });
    });
  };

  const addRecentralizeButton = (map: google.maps.Map) => {
    const buttonContainer = document.createElement('div');
    buttonContainer.addEventListener('click', () => {
      setLocationToCurrent(map);
    });
    const staticElement = renderToStaticMarkup(<RecentralizeButton />);
    buttonContainer.innerHTML = staticElement;
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
      buttonContainer
    );
  };

  const drawPath = (map: google.maps.Map, coordinates: google.maps.LatLngLiteral[]) => {
    const path = new window.google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    path.setMap(map);
  };

  return {
    setup,
    setLocationToCurrent,
    addRecentralizeButton,
    drawPath
  };
};
