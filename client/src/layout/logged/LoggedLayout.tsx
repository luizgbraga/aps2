import React from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { BaseLayout, SidebarItem, SidebarSection } from '../BaseLayout';

type Props = {
  children: React.ReactNode;
  selected: string;
  projectless?: boolean;
  title?: string;
  extra?: React.ReactNode;
  refetch?: () => void;
};

export const LoggedLayout: React.FC<Props> = (props: Props) => {
  const nav = useNavigate();

  const baseItems: SidebarItem[] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      title: 'Home',
      onClick: () => nav(`/home`),
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      title: 'Notificações',
      onClick: () => nav(`/notifications`),
    },
  ];

  const meItems: SidebarItem[] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      title: 'Profile',
      onClick: () => nav('/profile'),
    },
  ];

  const sections: SidebarSection[] = [
    {
      key: null,
      title: null,
      items: baseItems,
    },

    {
      key: 'me',
      title: 'Me',
      items: meItems,
    },
  ];

  return <BaseLayout {...props} sections={sections} />;
};
