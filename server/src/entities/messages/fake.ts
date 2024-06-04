import { Message } from './schema';

export const fakeMessages = [
  {
    id: 'message1',
    text: 'text1',
    routeId: 'route1',
    createdAt: new Date(),
  },
  {
    id: 'message2',
    text: 'text2',
    routeId: 'route2',
    createdAt: new Date(),
  },
  {
    id: 'message3',
    text: 'text3',
    routeId: 'route2',
    createdAt: new Date(),
  },
] satisfies Message[];
