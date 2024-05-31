import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  HomeOutlined,
  AlertOutlined,
  CarOutlined,
  CheckOutlined,
} from '@ant-design/icons';

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
          key: 'home',
          icon: <HomeOutlined />,
          title: 'Home',
          onClick: () => nav('/_admin/home'),
        },
        {
          key: 'approve',
          icon: <CheckOutlined />,
          title: 'Aprovar',
          onClick: () => nav('/_admin/approve'),
        },
        {
          key: 'bus',
          icon: <CarOutlined />,
          title: 'Ônibus',
          onClick: () => nav('/_admin/bus'),
        },
        {
          key: 'occurrences',
          icon: <AlertOutlined />,
          title: 'Ocorrências',
          onClick: () => nav('/_admin/occurrences'),
        },
      ],
    },
  ];

  return <BaseLayout {...props} sections={sections} admin />;
};
