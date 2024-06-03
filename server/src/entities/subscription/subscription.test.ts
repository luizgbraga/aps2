import { describe, expect, it } from '@jest/globals';
import { FakeSubscriptionRepository } from './repository';

describe('subscribe', () => {
  it('should subscribe new neighborhood', async () => {
    const fakeSubscriptions = new FakeSubscriptionRepository([]);
    const newSubscription = {
      userId: '1234',
      neighborhoodId: 'ndojwq',
      unread: 0,
      createdAt: new Date(),
    };
    await expect(
      fakeSubscriptions.subscribe(
        newSubscription.userId,
        newSubscription.neighborhoodId,
      ),
    ).resolves.toEqual([newSubscription]);
  });

  it('should increment unread subscriptions', async () => {
    const fakeSubscriptions = new FakeSubscriptionRepository([
      {
        userId: 'user',
        neighborhoodId: '1',
        unread: 0,
        createdAt: new Date(),
      },
      {
        userId: 'user',
        neighborhoodId: '2',
        unread: 2,
        createdAt: new Date(),
      },
    ]);
    fakeSubscriptions.incrementUnread('2');
    expect(fakeSubscriptions.fakeSubscriptions[1].unread).toBe(3);
    expect(fakeSubscriptions.fakeSubscriptions[0].unread).toBe(0);
  });
});
