import { Subscription } from './schema';

export const fakeSubscriptions = [
  {
    neighborhoodId: 'neighborhood1',
    userId: 'user1',
    unread: 0,
    createdAt: new Date(),
  },
  {
    neighborhoodId: 'neighborhood2',
    userId: 'user1',
    unread: 0,
    createdAt: new Date(),
  },
  {
    neighborhoodId: 'neighborhood2',
    userId: 'user2',
    unread: 0,
    createdAt: new Date(),
  },
  {
    neighborhoodId: 'neighborhood2',
    userId: 'user3',
    unread: 0,
    createdAt: new Date(),
  },
] satisfies Subscription[];
