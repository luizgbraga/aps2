import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BaseLayout } from '../../layout/BaseLayout';

export const Home: React.FC = () => {
  const nav = useNavigate();
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
              onClick: () => nav('/home'),
            },
            {
              key: 'notifications',
              icon: <></>,
              title: 'Notificacoes',
              onClick: () => nav('/notifications'),
            },
          ],
        },
      ]}
    >
      <p>oi</p>
    </BaseLayout>
  );
};
