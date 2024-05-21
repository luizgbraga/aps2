import { users } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import { FindError, LoginError, RegisterError } from './errors';
import { generate } from '../../utils/token';
import { hash, compare } from '../../utils/hash';
import { validatePassword, validateCpf } from '../../utils/string';

export class UserRepository {
  static me = async (userId: string) => {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      if (result.length === 0) {
        throw new FindError('USER_NOT_FOUND');
      }
      return result[0];
    } catch (error) {
      throw error;
    }
  };

  static exists = async (cpf: string) => {
    const result = await db.select().from(users).where(eq(users.cpf, cpf));
    return result.length > 0;
  };

  static register = async (cpf: string, password: string) => {
    try {
      console.log(cpf);
      if (!validateCpf(cpf)) {
        throw new RegisterError('INVALID_CPF');
      }
      if (!validatePassword(password)) {
        throw new RegisterError('INVALID_PASSWORD');
      }
      if (await UserRepository.exists(cpf)) {
        throw new RegisterError('USER_ALREADY_EXISTS');
      }
      const passwordHash = await hash(password);
      const [user] = await db
        .insert(users)
        .values({ cpf, password: passwordHash })
        .returning();
      const token = generate(user.id);
      return token;
    } catch (error) {
      throw error;
    }
  };

  static login = async (cpf: string, password: string) => {
    try {
      if (!validateCpf(cpf)) {
        throw new LoginError('INVALID_CPF');
      }
      const result = await db
        .select()
        .from(users)
        .where(and(eq(users.cpf, cpf)));
      if (result.length === 0) {
        throw new LoginError('USER_NOT_REGISTERD');
      }
      const correctPassword = await compare(password, result[0].password);
      if (!correctPassword) {
        throw new LoginError('WRONG_PASSWORD');
      }
      const token = generate(result[0].id);
      return token;
    } catch (error) {
      throw error;
    }
  };
}
