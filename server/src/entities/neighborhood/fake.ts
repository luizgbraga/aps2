import { Neighborhood } from './schema';

export const fakeNeighborhoods = [
  {
    id: 'neighborhood1',
    name: 'name1',
    zone: 'zone1',
  },
  {
    id: 'neighborhood2',
    name: 'name2',
    zone: 'zone2',
  },
  {
    id: 'neighborhood3',
    name: 'name3',
    zone: 'zone3',
  },
] satisfies Neighborhood[];
