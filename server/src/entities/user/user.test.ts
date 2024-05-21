import { describe, expect } from '@jest/globals';
import { validateCpf } from '../../utils/string';

describe('validateCpf', () => {
  it('should return true for a valid CPF', () => {
    const validCpf = '123.456.789-09';
    expect(validateCpf(validCpf)).toBe(true);
  });
});
