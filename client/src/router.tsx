import { Foo } from './routes/Foo';
import { Login, Register } from './routes/login'; 

import { PREFIXES } from './utils/environ';

const loginRoutes = [
  { path: 'register', element: <Register /> },
  { path: 'login', element: <Login /> },
];

const adminRoutes = [{ path: 'foo', element: <Foo /> }];


export const router = [
  { prefix: null, routes: loginRoutes },
  { prefix: PREFIXES.admin, routes: adminRoutes },
];
