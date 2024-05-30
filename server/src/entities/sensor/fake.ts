import { FakeSensor } from './schema';

export const sensors = [
  {
    id: '1',
    latitude: -22.9068,
    longitude: -43.1729,
    radius: 2000,
    floodingInterval: {
      start: 10,
      end: 12,
    },
    landslideInterval: {
      start: 0,
      end: 0,
    },
    congestionInterval: {
      start: 18,
      end: 20,
    },
  },
] satisfies FakeSensor[];
