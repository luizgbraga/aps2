import React from 'react';

import { LoggedLayout } from '../../layout/logged/LoggedLayout';

export const Home: React.FC = () => {
  return (
    <LoggedLayout selected="home">
      <p>oi</p>
    </LoggedLayout>
  );
};
