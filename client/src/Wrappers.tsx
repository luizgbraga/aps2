import React, { createContext } from 'react';

import { UserModel } from './api/user';

import { INITIAL_ASYNC } from './utils/async';
import { useAsync, type Async } from './utils/async';

type Props = {
  children: React.ReactNode;
};


export const AuthContext = createContext<Async<UserModel>>(INITIAL_ASYNC);

export const LoggedWrapper: React.FC<Props> = ({ children }) => {
  const me = useAsync(() => UserModel.me());
  
  return (
    <AuthContext.Provider value={me}>
          {children}
    </AuthContext.Provider>
  );
};


