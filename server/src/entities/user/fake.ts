import { User } from './schema';

export const fakeUsers = [
  {
    id: 'user1',
    cpf: '111.111.111-11',
    password: 'password1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user2',
    cpf: '222.222.222-22',
    password: 'password2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user3',
    cpf: '333.333.333-33',
    password: 'password3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] satisfies User[];
