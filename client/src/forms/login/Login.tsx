import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Form,
  Input,
  Typography,
  notification,
  Segmented,
} from 'antd';
import { LoginModel } from '../../api/login';

export const LoginForm: React.FC = () => {
  const nav = useNavigate();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    LoginModel.register(cpf, password)
      .then((res) => {
        notification.success({
          message: 'Success',
          description: 'User registered',
        });
        localStorage.setItem('token', res);
        nav('/home');
      })
      .catch((e) => {
        notification.error({
          message: 'Error',
          description: e.message,
        });
      });
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
          {' '}
          <Segmented
            options={['Cidadão', 'Ônibus']}
            size="large"
            style={{ marginBottom: '20px' }}
          />
          <Typography.Title level={2} style={{ margin: 4 }}>
            Bem-vindo de volta
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '18px' }}>
            Ainda não tem uma conta?{' '}
            <Typography.Link
              style={{ fontSize: '18px' }}
              onClick={() => nav('/register')}
            >
              Cadastre-se
            </Typography.Link>
          </Typography.Paragraph>
        </Flex>
        <Form.Item label="CPF" name="cpf">
          <Input
            size="large"
            onChange={(e) => setCpf(e.target.value)}
            placeholder="XXX.XXX.XXX-XX"
          />
        </Form.Item>
        <Form.Item label="password" name="password">
          <Input.Password
            size="large"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Insira no mínimo 6 caracteres"
          />
        </Form.Item>
        <Form.Item style={{ marginTop: '36px' }}>
          <Button type="primary" htmlType="submit" block size="large">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
