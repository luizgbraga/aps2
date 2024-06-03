import { describe, expect, it } from '@jest/globals';
import { FakeUserRepository } from './repository';
import { LoginError, RegisterError } from './errors';
import { hash } from '../../utils/hash';


const setup = () => {
  return new FakeUserRepository();
};

describe('register', () => {
  it('should not register user with invalid cpf', async () => { 
    const repository = setup();
    const cpf = '112312321387329187321';
    const password = 'password1';
    await expect(repository.register(cpf, password)).rejects.toThrow(RegisterError); 
  });

  it('should not register user with invalid password', async () => { 
    const repository = setup();
    const cpf = '123456789';
    const password = '123';
    await expect(repository.register(cpf, password)).rejects.toThrow(RegisterError); 
  });
  
  it('should not register user that already exists', async () => { 
    const repository = setup();
    repository.users.push({
      id: '1',
      cpf: '479.279.378-55',
      password: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const cpf = '479.279.378-55';
    const password = '12345678';
    await expect(repository.register(cpf, password)).rejects.toThrow(RegisterError); 
  });

  it('should register user', async () => {
    const repository = setup();
    const cpf = '479.279.378-55';
    const password = '12345678';
    await expect(repository.register(cpf, password)).resolves.toBe('fake_token'); 
  });

});

describe('login', () => {
  it('should not login user with invalid cpf', async () => { 
    const repository = setup();
    const cpf = '112312321387329187321';
    const password = 'password1';
    await expect(repository.login(cpf, password)).rejects.toThrow(LoginError); 
  });

  it('should not login user that does not exist', async () => { 
    const repository = setup();
    const cpf = '123.456.789-10';
    const password = '12345678';
    await expect(repository.login(cpf, password)).rejects.toThrow(LoginError); 
  });
  
  it('should not login user with incorrect password', async () => {
    const repository = setup();
    repository.users.push({
      id: '1',
      cpf: '479.279.378-55',
      password: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const cpf = '479.279.378-55';
    const password = '12345679';
    await expect(repository.login(cpf, password)).rejects.toThrow(LoginError); 
  });

  it('should login', async () => { 
    const repository = setup();
    const passwordHash = await hash("12345678");
    repository.users.push({
      id: '1',
      cpf: '479.279.378-55',
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const cpf = '479.279.378-55';
    const password = '12345678';
    await expect(repository.login(cpf, password)).resolves.toBe("fake_token"); 
  });
});
