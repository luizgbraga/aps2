import { Storage } from './storage';

export const getToken = () => {
  const token = Storage.get('token');
  if (!token) {
    throw new Error('Unauthorized');
  }
  return token;
};