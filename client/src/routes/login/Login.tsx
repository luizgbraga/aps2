import React from 'react';
import { Unlogged } from '../../layout/unlogged/Unlogged';

import { LoginForm } from '../../forms/login/Login';

export const Login: React.FC = () => {
  return (
    <Unlogged hideNav>
      <LoginForm />
    </Unlogged>
  );
};
