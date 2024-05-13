import React, { useContext, useState } from 'react';
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
import { toCpf } from '../../utils/string';
import { AuthContext } from '../../Wrappers';

type Login = 'Cidadão' | 'Ônibus';

export const LoginForm: React.FC = () => {
  const nav = useNavigate();
  const me = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState<Login>('Cidadão');

  const onSubmit = () => {
    setLoading(true);
    LoginModel.login(cpf, password)
      .then((res) => {
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
          {' '}
          <Segmented
            options={['Cidadão', 'Ônibus']}
            value={login}
            onChange={setLogin}
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
        <Form.Item label="CPF">
          <Input
            maxLength={14}
            value={cpf}
            size="large"
            onChange={(e) => setCpf(toCpf(e.target.value))}
            placeholder="XXX.XXX.XXX-XX"
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
