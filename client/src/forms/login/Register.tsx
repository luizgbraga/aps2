import React from 'react';

import { Button, Flex, Form, Input, Segmented, Typography } from 'antd';

export const RegisterForm: React.FC = () => {
  return (
    <Flex
      justify="center"
      align="center"
      style={{ height: '100%', width: '100%' }}
    >
      <Form name="register" layout="vertical" style={{ width: '27.5%' }}>
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
          <Input placeholder="CPF" size="large" />
        </Form.Item>
        <Form.Item label="password" name="password">
          <Input.Password placeholder="password" size="large" />
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
