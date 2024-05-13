import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Logo } from './Logo';

import { Layout, Menu, Button, Flex, Divider, Tag, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
import MenuDivider from 'antd/es/menu/MenuDivider';
import { Storage } from '../utils/storage';

import './base-layout.css';
import { AddOccurrence } from '../components/AddOccurrence';
import { AuthContext } from '../Wrappers';

type Props = {
  children: React.ReactNode;
  selected: string;
  title?: string;
  extra?: React.ReactNode;
  sections: SidebarSection[];
  refetch?: () => void;
};

export type SidebarItem = {
  key: string;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  soon?: boolean;
  disabled?: boolean;
};

export type SidebarSection = {
  key: string | null;
  title?: string | null;
  items: SidebarItem[];
};

export const BaseLayout: React.FC<Props> = (props: Props) => {
  const nav = useNavigate();
  const { result: me } = useContext(AuthContext);
  const [modal, setModal] = useState(false);

  const logout = () => {
    Storage.remove('token');
    nav('/login');
  };

  return (
    <Layout className="base-layout">
      <Layout.Sider width={250} className="base-sider">
        <div className="base-logo">
          <Logo width={50} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[props.selected]}
          className="base-menu"
        >
          {props.sections.map((section) => {
            if (section.key) {
              return (
                <Menu.ItemGroup key={section.key} title={section.title}>
                  {section.items.map((item) => (
                    <Menu.Item
                      key={item.key}
                      onClick={item.onClick}
                      disabled={item.soon || item.disabled}
                    >
                      {item.icon}
                      <span style={{ fontSize: '14.5px' }}>{item.title}</span>
                      {item.soon && (
                        <Tag color="cyan" className="base-soon">
                          Soon
                        </Tag>
                      )}
                      {item.disabled && <LockOutlined className="base-lock" />}
                    </Menu.Item>
                  ))}
                </Menu.ItemGroup>
              );
            }
            return section.items.map((item) => (
              <Menu.Item
                key={item.key}
                onClick={item.onClick}
                disabled={item.soon}
              >
                {item.icon}
                <span style={{ fontSize: '14.5px' }}>{item.title}</span>
                {item.soon && (
                  <Tag color="cyan" className="base-soon">
                    Soon
                  </Tag>
                )}
              </Menu.Item>
            ));
          })}
          <MenuDivider />
          <Menu.Item onClick={logout} key="logout">
            <LogoutOutlined />
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header className="base-header">
          <Flex
            justify="space-between"
            align="center"
            style={{ width: '100%' }}
          >
            <Button onClick={() => setModal(true)}>Add occ</Button>
            <Flex gap="20px" align="center">
              <Button icon={<UserOutlined />} onClick={() => nav('/profile')}>
                {me?.cpf}
              </Button>
            </Flex>
          </Flex>
        </Layout.Header>
        <Divider style={{ margin: 0 }} />
        <Layout.Content className="base-content">
          {props.title && (
            <Flex gap="30px" className="base-title">
              <Typography.Title>{props.title}</Typography.Title>
              {props.extra}
            </Flex>
          )}
          {props.children}
        </Layout.Content>
      </Layout>
      <AddOccurrence open={modal} onCancel={() => setModal(false)} />
    </Layout>
  );
};
