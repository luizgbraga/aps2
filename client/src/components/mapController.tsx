import { renderToStaticMarkup } from 'react-dom/server';
import { RecentralizeButton } from './RecentralizeButton';

const DEFAULT_LOCATION = { lat: -22.9068, lng: -43.1729 };

export const mapController = (pinnable: boolean) => {
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

  const renderRecenterButton = (map: google.maps.Map) => {
    const buttonContainer = document.createElement('div');
    buttonContainer.addEventListener('click', () => {
      setLocationToCurrent(map);
    });
    const staticElement = renderToStaticMarkup(<RecentralizeButton />);
    buttonContainer.innerHTML = staticElement;
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].setAt(
      0,
      buttonContainer
    );
  };

  const drawPaths = (
    map: google.maps.Map,
    paths: {
      shape: google.maps.LatLngLiteral[];
      color: string;
      text_color: string;
    }[]
  ) => {
    paths.forEach((element) => {
      const path = new window.google.maps.Polyline({
        path: element.shape,
        geodesic: true,
        strokeColor: element.color,
        strokeOpacity: 0.6,
        strokeWeight: 4,
      });
      path.setMap(map);
    });
  };

  const initMarker = (map: google.maps.Map) => {
    if (!pinnable) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
      });
    });
  };

  return {
    setup,
    setLocationToCurrent,
    addRecentralizeButton: renderRecenterButton,
    drawPaths,
    initMarker,
  };
};
