import { ALogin, AHome, ABus, AOccurrences } from './routes/admin';
import { Login, Register } from './routes/login';
import { Home } from './routes/user/Home';
import Ocurrences from './routes/ocurrences';

import { PREFIXES } from './utils/environ';

const loginRoutes = [
  { path: 'register', element: <Register /> },
  { path: 'login', element: <Login /> },
];

const userRoutes = [
  { path: 'home', element: <Home /> },
  { path: 'notifications', element: <Ocurrences /> },
];

const adminRoutes = [
  { path: 'login', element: <ALogin /> },
  { path: 'home', element: <AHome /> },
  { path: 'bus', element: <ABus /> },
  { path: 'occurrences', element: <AOccurrences /> },
];

export const router = [
  { prefix: null, routes: loginRoutes },
  { prefix: PREFIXES.admin, routes: adminRoutes },
  { prefix: null, routes: userRoutes },
];
