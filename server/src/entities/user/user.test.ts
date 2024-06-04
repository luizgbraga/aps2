import { describe, expect, it } from '@jest/globals';
import { LoginError, RegisterError } from './errors';
import { fakeRepositories } from '../../entities/factory';

describe('register', () => {
  it('should not register user with invalid cpf', async () => {
    const cpf = '112312321387329187321';
    const password = 'password1';
    await expect(fakeRepositories.user.register(cpf, password)).rejects.toThrow(
      RegisterError,
    );
  });

  it('should not register user with invalid password', async () => {
    const cpf = '123456789';
    const password = '123';
    await expect(fakeRepositories.user.register(cpf, password)).rejects.toThrow(
      RegisterError,
    );
  });

  it('should not register user that already exists', async () => {
    const cpf = fakeRepositories.user.users[0].cpf;
    const password = fakeRepositories.user.users[0].password;
    await expect(fakeRepositories.user.register(cpf, password)).rejects.toThrow(
      RegisterError,
    );
  });

  it('should register user', async () => {
    const cpf = '479.279.378-55';
    const password = '12345678';
    await expect(fakeRepositories.user.register(cpf, password)).resolves.toBe(
      'fake_token',
    );
  });
});

describe('login', () => {
  it('should not login user with invalid cpf', async () => {
    const cpf = '112312321387329187321';
    const password = 'password1';
    await expect(fakeRepositories.user.login(cpf, password)).rejects.toThrow(
      LoginError,
    );
  });

  it('should not login user that does not exist', async () => {
    const cpf = '123.456.789-10';
    const password = '12345678';
    await expect(fakeRepositories.user.login(cpf, password)).rejects.toThrow(
      LoginError,
    );
  });

  it('should not login user with incorrect password', async () => {
    const cpf = fakeRepositories.user.users[0].cpf;
    const password = 'abuble';
    await expect(fakeRepositories.user.login(cpf, password)).rejects.toThrow(
      LoginError,
    );
  });

  it('should login', async () => {
    const cpf = fakeRepositories.user.users[0].cpf;
    const password = fakeRepositories.user.users[0].password;
    await expect(fakeRepositories.user.login(cpf, password)).resolves.toBe(
      'fake_token',
    );
  });
});
