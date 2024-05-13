import jwt from 'jsonwebtoken';

export const generate = (id: string) => {
  const secret = process.env.TOKEN_SECRET as string;
  const token = jwt.sign({ id }, secret, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  return token;
};
