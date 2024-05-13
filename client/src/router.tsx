import { Foo } from './routes/Foo';
import { Login, Register } from './routes/login';
import { Home } from './routes/user/Home';
import { Notifications } from './routes/user/Notifications';

import { PREFIXES } from './utils/environ';

const loginRoutes = [
  { path: 'register', element: <Register /> },
  { path: 'login', element: <Login /> },
];

const userRoutes = [
  { path: 'home', element: <Home /> },
  { path: 'notifications', element: <Notifications /> },
];

const adminRoutes = [{ path: 'foo', element: <Foo /> }];

export const router = [
  { prefix: null, routes: loginRoutes },
  { prefix: PREFIXES.admin, routes: adminRoutes },
  { prefix: null, routes: userRoutes },
];
