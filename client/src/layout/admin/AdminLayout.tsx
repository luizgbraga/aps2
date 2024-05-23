import React from 'react';

import { AlertOutlined, CarOutlined, HomeOutlined } from '@ant-design/icons';
import { SidebarSection } from '../../_nav';
import { BaseLayout } from '../BaseLayout';

type Props = {
  children: React.ReactNode;
  selected: string;
  title?: string;
};

export const AdminLayout: React.FC<Props> = (props: Props) => {
  const sections: SidebarSection[] = [
    {
      key: 'home',
      items: [
        {
          key: 'home',
          icon: <HomeOutlined />,
          title: 'Home',
          to: '/_admin/home',
        },
        {
          key: 'bus',
          icon: <CarOutlined />,
          title: 'Ônibus',
          to: '/_admin/bus',
        },
        {
          key: 'occurrences',
          icon: <AlertOutlined />,
          title: 'Ocorrências',
          to: '/_admin/occurrences',
        },
      ],
    },
  ];

  return <BaseLayout {...props} sections={sections} admin />;
};
