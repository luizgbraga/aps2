import { describe, expect, it } from '@jest/globals';
import { AffectRepository } from './repository';

describe('updateAffectedRoutes', () => {
  it('should return the expected array of route_ids', async () => {
    const expectedResult = [
      { route_id: 'E2310AAA0A' },
      { route_id: 'O0369AAA0A' },
      { route_id: 'O0389AAA0A' },
      { route_id: 'O0397AAA0A' },
      { route_id: 'O0397AAN0A' },
      { route_id: 'O0397AAR0A' },
      { route_id: 'O0731AAA0A' },
      { route_id: 'O0731AAN0A' },
      { route_id: 'O0737AAA0A' },
      { route_id: 'O0741AAA0A' },
      { route_id: 'O0788AAA0A' },
      { route_id: 'O0812AAA0A' },
      { route_id: 'O0819AAA0A' },
      { route_id: 'O0926AAA0A' }
    ];
    const result = await AffectRepository.updateAffectedRoutes(
      '123',
      -22.874878,
      -43.463678,
      50
    );
    expect(result).toEqual(expectedResult);
  });
});
