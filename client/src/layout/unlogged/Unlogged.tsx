import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Logo } from '../Logo';

import { Layout, Button, Divider } from 'antd';

import './unlogged.css';

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
        <Button type="primary" size="large" onClick={() => nav('/register')}>
          Criar uma conta
        </Button>
      </Layout.Header>
      <Divider style={{ margin: 0 }} />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};
