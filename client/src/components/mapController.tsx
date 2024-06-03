import { renderToStaticMarkup } from 'react-dom/server';
import { RecentralizeButton } from './RecentralizeButton';

const DEFAULT_LOCATION = { lat: -22.9068, lng: -43.1729 };

export const mapController = () => {
  const setup = (ref: HTMLDivElement) => {
    const map = new window.google.maps.Map(ref, {
      center: DEFAULT_LOCATION,
      zoom: 12,
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
      route_id: string | undefined;
      shape: google.maps.LatLngLiteral[];
      color: string;
      text_color: string;
    }[],
    setPolylines: any
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
      setPolylines((polylines: any) => [
        ...polylines,
        { route_id: element.route_id, polyline: path },
      ]);
    });
  };

  const clearPaths = (
    polylines: {
      route_id: string | undefined;
      polyline: google.maps.Polyline;
    }[]
  ) => {
    polylines.forEach((element) => {
      element.polyline.setMap(null);
    });
  };

  const addMarker = (
    map: google.maps.Map,
    position: google.maps.LatLngLiteral,
    pin: boolean = false
  ): google.maps.Marker => {
    if (pin) {
      return new window.google.maps.Marker({
        position,
        map,
      });
    }
    return new window.google.maps.Marker({
      position,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: 'red',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 1,
      },
    });
  };

  return {
    setup,
    setLocationToCurrent,
    addRecentralizeButton: renderRecenterButton,
    drawPaths,
    addMarker,
    clearPaths,
  };
};
