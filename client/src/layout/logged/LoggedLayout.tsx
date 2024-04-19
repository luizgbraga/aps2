import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  HomeOutlined,
  UserOutlined,
  BulbOutlined,
} from '@ant-design/icons';
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
  ];

  const analyticsItems: SidebarItem[] = [
    {
      key: 'insights',
      icon: <BulbOutlined />,
      title: "Insights",
      onClick: () => nav('/insights'),
      soon: true,
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
      key: 'analytics',
      title: 'Analytics',
      items: analyticsItems,
    },
    {
      key: 'me',
      title: 'Me',
      items: meItems,
    },
  ];

  return <BaseLayout {...props} sections={sections} />;
};
