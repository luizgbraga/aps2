import { describe, expect, it } from '@jest/globals';
import { validateCpf } from '../../utils/string';
import { FakeUserRepository } from './repository';
import { RegisterError } from './errors';

const setup = () => {
  return new FakeUserRepository();
};

describe('register', () => {
  it('should not register user with invalid cpf', () => {
    const repository = setup();
    const cpf = '47927937855';
    const password = '12345678';
    expect(repository.register(cpf, password)).rejects.toThrow(RegisterError);
  });

  it('should not register user with invalid password', () => {
    const repository = setup();
    const cpf = '47927937855';
    const password = '123';
    expect(repository.register(cpf, password)).rejects.toThrow(RegisterError);
  });

  it('should not register user that already exists', () => {
    const repository = setup();
    repository.users.push({
      id: '1',
      cpf: '47927937855',
      password: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const cpf = '47927937855';
    const password = '12345678';
    expect(repository.register(cpf, password)).rejects.toThrow(RegisterError);
  });

  it('should register user', () => {
    const repository = setup();
    const cpf = '47927937855';
    const password = '12345678';
    expect(repository.register(cpf, password)).resolves.toBe('fake_token');
  });
});
