import React from 'react';
import { HomeOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';

export type SidebarItem = {
  key: string;
  icon: React.ReactNode;
  title: string;
  to: string;
  soon?: boolean;
  disabled?: boolean;
};

export type SidebarSection = {
  key: string | null;
  title?: string | null;
  items: SidebarItem[];
};

const Nav: SidebarSection[] = [
  {
    key: null,
    title: null,
    items: [
      {
        key: 'home',
        icon: <HomeOutlined />,
        title: 'Home',
        to: '/home',
      },
      {
        key: 'notifications',
        icon: <BellOutlined />,
        title: 'Notificações',
        to: '/notifications',
      },
    ],
  },
  {
    key: 'me',
    title: 'Me',
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        title: 'Profile',
        to: '/profile',
      },
    ],
  },
];
export default Nav;
