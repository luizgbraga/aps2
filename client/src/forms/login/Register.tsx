import React, { useState } from 'react';

import {
  Button,
  Flex,
  Form,
  Input,
  Segmented,
  Typography,
  notification,
} from 'antd';
import { LoginModel } from '../../api/login';

export const RegisterForm: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    LoginModel.register(cpf, password).then(() => {
      notification.success({
        message: 'Success',
        description: 'User registered',
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
          <Segmented options={['cidadao', 'onibus']} />
          <Typography.Title level={2} style={{ margin: 4 }}>
            Registra
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '18px' }}>
            Subtitle
          </Typography.Paragraph>
        </Flex>
        <Form.Item label="CPF" name="cpf">
          <Input
            placeholder="CPF"
            size="large"
            onChange={(e) => setCpf(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="password" name="password">
          <Input.Password
            placeholder="password"
            size="large"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item style={{ marginTop: '36px' }}>
          <Button type="primary" htmlType="submit" block size="large">
            Bora
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
