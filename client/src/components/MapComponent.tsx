import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_LOCATION = { lat: -22.9068, lng: -43.1729 }; // Rio de Janeiro coordinates

function customizeButton(button: HTMLButtonElement): HTMLButtonElement {
  button.style.backgroundColor = '#fff';
  button.style.border = '2px solid #fff';
  button.style.borderRadius = '3px';
  button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  button.style.cursor = 'pointer';
  button.style.margin = '10px';
  button.style.padding = '0';
  button.style.width = '40px';
  button.style.height = '40px';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  return button;
}

export default function MapComponent() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const setMapToCurrentLocation = (map: google.maps.Map) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.setCenter({ lat: latitude, lng: longitude });
    });
  };
  const addRecentralizeButton = (map: google.maps.Map) => {
    if (document.querySelector('.custom-map-control-button')) {
      return;
    }
    const buttonDiv = document.createElement('div');
    let button = document.createElement('button');
    // Create the SVG icon
    const svgIcon = `
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 2a1 1 0 0 1 2 0v2.062A8.004 8.004 0 0 1 19.938 11H22a1 1 0 0 1 0 2h-2.062A8.004 8.004 0 0 1 13 19.938V22a1 1 0 0 1-2 0v-2.062A8.004 8.004 0 0 1 4.062 13H2a1 1 0 0 1 0-2h2.062A8.004 8.004 0 0 1 11 4.062V2zm7 10a6 6 0 1 0-12 0 6 6 0 0 0 12 0zm-3 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="#666666"/></svg>
        `;

    button.innerHTML = svgIcon;
    button.classList.add('custom-map-control-button');

    button = customizeButton(button);
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#ebebeb';
    });
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#fff';
    });

    button.addEventListener('click', () => setMapToCurrentLocation(map));

    buttonDiv.appendChild(button);
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
      buttonDiv
    );
  };

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: DEFAULT_LOCATION,
          zoom: 16,
        })
      );
    }
    if (map) {
      setMapToCurrentLocation(map);
      addRecentralizeButton(map);
    }
  }, [map]);

  return (
    <div
      ref={ref}
      style={{
        height: 'calc(100vh - 144px)',
        width: '100%',
        display: map ? 'flex' : 'none',
      }}
    />
  );
}
