import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Form, Input, Typography, notification } from 'antd';
import { LoginModel } from '../../api/login';
import { toCpf } from '../../utils/string';
import { AuthContext } from '../../Wrappers';

export const RegisterForm: React.FC = () => {
  const nav = useNavigate();
  const me = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    setLoading(true);
    LoginModel.register(cpf, password)
      .then((res) => {
        notification.success({
          message: 'Success',
          description: 'User registered',
        });
        localStorage.setItem('token', res);
        nav('/home');
        me.refetch();
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
            Cadastre-se
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '18px' }}>
            Já tem uma conta?{' '}
            <Typography.Link
              onClick={() => nav('/login')}
              style={{ fontSize: '18px' }}
            >
              Faça login
            </Typography.Link>
          </Typography.Paragraph>
        </Flex>
        <Form.Item label="CPF">
          <Input
            maxLength={14}
            value={cpf}
            placeholder="XXX.XXX.XXX-XX"
            size="large"
            onChange={(e) => setCpf(toCpf(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Senha" name="password">
          <Input.Password
            placeholder="Insira sua senha"
            size="large"
            onChange={(e) => setPassword(e.target.value)}
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
            Cadastrar
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
