import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserModel } from './api/user';

import { INITIAL_ASYNC } from './utils/async';
import { useAsync, type Async } from './utils/async';
import { Modal } from 'antd';
import { environ } from './utils/environ';
import { AdminModel } from './api/admin';

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext<Async<UserModel>>(INITIAL_ASYNC);
export const AdminContext = createContext<Async<AdminModel>>(INITIAL_ASYNC);

export const LoggedWrapper: React.FC<Props> = ({ children }) => {
  const me = useAsync(() => UserModel.me());
  const admin = useAsync(() => AdminModel.me());
  const nav = useNavigate();
  if (!me.result && !me.loading && me.error && environ() === 'user') {
    Modal.error({
      title: 'Um erro ocorreu',
      content: 'Você precisa estar logado para acessar essa página',
      onOk: () => {
        nav('/login');
      },
      okText: 'Fazer login',
    });
  }
  if (!admin.result && !admin.loading && admin.error && environ() === 'admin') {
    Modal.error({
      title: 'Um erro ocorreu',
      content: 'Você não tem permissão para acessar essa página',
      onOk: () => {
        nav('/_admin/login');
      },
      okText: 'Fazer login',
    });
  }
  return (
    <AuthContext.Provider value={me}>
      <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
    </AuthContext.Provider>
  );
};
