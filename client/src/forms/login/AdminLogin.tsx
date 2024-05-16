import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Form, Input, Typography, notification } from 'antd';
import { AdminLoginModel } from '../../api/admin';

export const AdminLogin: React.FC = () => {
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    setLoading(true);
    AdminLoginModel.login(username, password)
      .then((res) => {
        localStorage.setItem('token', res);
        nav('/admin/home');
      })
      .catch((e) => {
        notification.error({
          message: 'Error',
          description: e.message,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: '100%', width: '100%' }}
    >
      <Form
        name="register"
        layout="vertical"
        style={{ width: '27.5%' }}
        onFinish={onSubmit}
      >
        <Flex vertical align="center">
          <Typography.Title level={2} style={{ margin: 4 }}>
            Painel de administração
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '18px' }}>
            Chegou aqui por engano?{' '}
            <Typography.Link
              style={{ fontSize: '18px' }}
              onClick={() => nav('/register')}
            >
              Cadastre-se
            </Typography.Link>
          </Typography.Paragraph>
        </Flex>
        <Form.Item label="Nome de usuário">
          <Input
            value={username}
            size="large"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu nome de usuário"
          />
        </Form.Item>
        <Form.Item label="Senha" name="password">
          <Input.Password
            size="large"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira no mínimo 6 caracteres"
          />
        </Form.Item>
        <Form.Item style={{ marginTop: '36px' }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
