import React from 'react';
import { Unlogged } from '../../layout/unlogged/Unlogged';
import { RegisterForm } from '../../forms/login/Register';

export const Register: React.FC = () => {
  return (
    <Unlogged hideNav>
      <RegisterForm />
    </Unlogged>
  );
};
