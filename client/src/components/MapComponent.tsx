import { useRef } from 'react';
import { useMap } from './useMap';

export default function MapComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const map = useMap(ref);

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
