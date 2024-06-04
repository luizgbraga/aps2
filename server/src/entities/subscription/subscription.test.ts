import { describe, expect, it } from '@jest/globals';
import { FakeSubscriptionRepository } from './repository';
import { date } from 'drizzle-orm/mysql-core';

describe('subscribe', () => {
  it('should subscribe new neighborhood', async () => {
    const fakeSubscriptions = new FakeSubscriptionRepository([]);
    const newSubscription = {
      userId: '1234',
      neighborhoodId: 'Botafogo',
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

  it('should unsubscribe neighborhood', async () => {
    const date1 = new Date("2024-06-03T12:00:00Z");
    const date2 = new Date("2023-06-03T12:00:00Z");
    const date3 = new Date("2021-06-03T12:00:00Z");

    const initalSubscriptions = [
      {
        userId: '1234',
        neighborhoodId: 'Botafogo',
        unread: 0,
        createdAt: date1,
      },
      {
        userId: '1234',
        neighborhoodId: 'Flamengo',
        unread: 0,
        createdAt: date1,
      },
      {
        userId: '2222',
        neighborhoodId: 'Barra',
        unread: 0,
        createdAt: date2,
      },
      {
        userId: '1234',
        neighborhoodId: 'Catete',
        unread: 0,
        createdAt: date2,
      },
    ]
    const fakeSubscriptions = new FakeSubscriptionRepository(initalSubscriptions);
    expect(
      fakeSubscriptions.unsubscribe(
        "1234",
        "Botafogo",
      ),
    ).resolves.toEqual([
      {
        userId: '1234',
        neighborhoodId: 'Botafogo',
        unread: 0,
        createdAt: date1,
      }
    ]);
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

  it('should set unread subscriptions to zero', async () => {
    const date1 = new Date("2024-06-03T12:00:00Z");
    const date2 = new Date("2023-06-03T12:00:00Z");
    const date3 = new Date("2021-06-03T12:00:00Z");

    const initalSubscriptions = [
      {
        userId: '1234',
        neighborhoodId: 'Botafogo',
        unread: 1,
        createdAt: date1,
      },
      {
        userId: '1234',
        neighborhoodId: 'Flamengo',
        unread: 1,
        createdAt: date1,
      },
      {
        userId: '2222',
        neighborhoodId: 'Barra',
        unread: 1,
        createdAt: date2,
      },
      {
        userId: '1234',
        neighborhoodId: 'Catete',
        unread: 1,
        createdAt: date2,
      },
    ]
    const fakeSubscriptions = new FakeSubscriptionRepository(initalSubscriptions);
    fakeSubscriptions.setUnreadToZero("1234");
    expect(fakeSubscriptions.fakeSubscriptions).toEqual([
      {
        userId: '1234',
        neighborhoodId: 'Botafogo',
        unread: 0,
        createdAt: date1,
      },
      {
        userId: '1234',
        neighborhoodId: 'Flamengo',
        unread: 0,
        createdAt: date1,
      },
      {
        userId: '2222',
        neighborhoodId: 'Barra',
        unread: 1,
        createdAt: date2,
      },
      {
        userId: '1234',
        neighborhoodId: 'Catete',
        unread: 0,
        createdAt: date2,
      },
    ])
  });
});
