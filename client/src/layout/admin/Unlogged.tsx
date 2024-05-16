import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Logo } from '../Logo';

import { Layout, Divider } from 'antd';

import './unlogged-admin.css';

type Props = {
  children: React.ReactNode;
  hideNav?: boolean;
  scrolls?: Record<string, () => void>;
};

export const Unlogged: React.FC<Props> = ({ children }) => {
  const nav = useNavigate();

  return (
    <Layout className="unlogged-layout">
      <Layout.Header className="unlogged-header">
        <Logo width={40} onClick={() => nav('/')} />
      </Layout.Header>
      <Divider style={{ margin: 0 }} />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};
