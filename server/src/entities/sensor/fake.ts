import { FakeSensor } from './schema';

export const sensors = [
  {
    id: '1',
    latitude: -22.950901,
    longitude: -43.185608,
    radius: 2000,
    neighborhoodId: '5c5c4acb-2747-4196-8bbf-f152c7d67c4f',
    floodingInterval: {
      start: 10,
      end: 12,
    },
    landslideInterval: {
      start: 0,
      end: 0,
    },
    congestionInterval: {
      start: 12,
      end: 23,
    },
  },
] satisfies FakeSensor[];
