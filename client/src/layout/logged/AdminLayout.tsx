import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeOutlined } from '@ant-design/icons';

import { BaseLayout, type SidebarSection } from '../BaseLayout';

type Props = {
  children: React.ReactNode;
  selected: string;
  title?: string;
};

export const AdminLayout: React.FC<Props> = (props: Props) => {
  const nav = useNavigate();

  const sections: SidebarSection[] = [
    {
      key: 'home',
      items: [
        {
          key: 'organizations',
          icon: <HomeOutlined />,
          title: 'Home',
          onClick: () => nav('/home'),
        },
      ],
    },
  ];

  return (
    <BaseLayout
      {...props}
      sections={sections}
    />
  );
};
