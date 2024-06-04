import { describe, expect, it } from '@jest/globals';
import { FakeOccurrenceRepository } from './repository';

describe('subscribe', () => {
  it('on confirming occurence, should increment unread from that neighborhood ', async () => {
    const fakeOccurrenceRepository = new FakeOccurrenceRepository(
      [
        {
          id: '1',
          neighborhoodId: '2',
          createdAt: new Date(),
          description: 'description',
          type: 'flooding',
          latitude: 'latitude',
          radius: 10,
          longitude: 'longitude',
          confirmed: false,
          updatedAt: new Date(),
          active: true,
        },
      ],
      [
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
      ],
    );
    fakeOccurrenceRepository.confirm('1');
    expect(fakeOccurrenceRepository.fakeSubscriptions[1].unread).toBe(3);
    expect(fakeOccurrenceRepository.fakeSubscriptions[0].unread).toBe(0);
  });
});
