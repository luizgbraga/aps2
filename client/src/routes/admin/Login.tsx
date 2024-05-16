import React from 'react';
import { Unlogged } from '../../layout/admin/Unlogged';

import { AdminLogin } from '../../forms/login/AdminLogin';

export const ALogin: React.FC = () => {
  return (
    <Unlogged hideNav>
      <AdminLogin />
    </Unlogged>
  );
};
