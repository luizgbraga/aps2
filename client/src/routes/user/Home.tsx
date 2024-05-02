import React from 'react';

import { BaseLayout } from '../../layout/BaseLayout';

export const Home: React.FC = () => {
  return (
    <BaseLayout
      selected="home"
      title="Home"
      sections={[
        {
          key: null,
          items: [
            {
              key: 'home',
              icon: <></>,
              title: 'Home',
              onClick: () => {},
            },
            {
              key: 'notifications',
              icon: <></>,
              title: 'Notificacoes',
              onClick: () => {},
            },
          ],
        },
      ]}
    >
      <h1>Home</h1>
    </BaseLayout>
  );
};
