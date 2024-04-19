// import React, { useContext } from 'react';

// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

// import { Button, Form, Input, notification, Typography, Flex } from 'antd';
// import { LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';

// import { LoginModel } from '../../api';
// import { FormControl, useFormDPO } from '../../utils/form';
// import { Storage } from '../../utils/storage';
// import { EMAIL_REGEX } from '../../utils/regex';
// import { AuthContext, ProjectsContext } from '../../Wrappers';

// export const LoginForm: React.FC = () => {
//   const { t } = useTranslation('common');
//   const nav = useNavigate();
//   const form = useFormDPO(new FormControl('email', 'password'));
//   const { refetch: refetchAuth } = useContext(AuthContext);
//   const { refetch: refetchProjects } = useContext(ProjectsContext);
//   const onSubmit = async (values: any) => {
//     form.clearErrors();
//     form.startLoading();
//     LoginModel.loginWithEmail(values.email, values.password)
//       .then((token) => {
//         form.endLoading();
//         Storage.set('token', token);
//         nav('/home');
//         refetchAuth();
//         refetchProjects();
//       })
//       .catch((err: Error) => {
//         form.endLoading();
//         if (err.message === 'NOT_FOUND') {
//           form.setError('email', t('login.errors.email-not-found'));
//           return;
//         }
//         if (err.message === 'INVALID_PASSWORD') {
//           form.setError('password', t('login.errors.wrong-password'));
//           return;
//         }
//         notification.error({
//           message: t('login.errors.generic'),
//           description: err.message,
//         });
//       });
//   };

//   const checkEmail = (e: any) => {
//     EMAIL_REGEX.test(e.target.value)
//       ? form.clearErrors('email')
//       : form.setError('email', t('login.errors.invalid-email'));
//   };

//   return (
//     <Flex
//       justify="center"
//       align="center"
//       style={{ height: '100%', width: '100%' }}
//     >
//       <Form
//         name="login"
//         onFinish={onSubmit}
//         layout="vertical"
//         style={{ width: '27.5%' }}
//       >
//         <Flex vertical align="center">
//           <Typography.Title level={2} style={{ margin: 4 }}>
//             {t('login.title')}
//           </Typography.Title>
//           <Typography.Paragraph style={{ fontSize: '18px' }}>
//             {t('login.subtitle')}
//             <Typography.Link
//               onClick={() => nav('/register')}
//               underline
//               style={{ fontSize: '18px', marginLeft: 6 }}
//             >
//               {t('login.subtitle-action')}
//             </Typography.Link>
//           </Typography.Paragraph>
//         </Flex>
//         <Form.Item
//           label={t('login.email')}
//           name="email"
//           rules={[
//             { required: true, message: t('register.errors.email-required') },
//           ]}
//           {...form.errors.email.message}
//         >
//           <Input
//             prefix={<MailOutlined className="site-form-item-icon" />}
//             placeholder={t('login.email-placeholder')}
//             size="large"
//             onChange={checkEmail}
//           />
//         </Form.Item>
//         <Form.Item
//           style={{ width: '100%' }}
//           label={
//             <Flex style={{ width: '100%' }} justify="space-between">
//               <span>{t('login.password')}</span>
//               <Typography.Link onClick={() => nav('/forgot-password')}>
//                 {t('login.forgot-password')}
//               </Typography.Link>
//             </Flex>
//           }
//           name="password"
//           rules={[
//             { required: true, message: t('register.errors.password-required') },
//           ]}
//           {...form.errors.password.message}
//         >
//           <Input.Password
//             prefix={<LockOutlined className="site-form-item-icon" />}
//             placeholder={t('login.password-placeholder')}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item style={{ marginTop: '36px' }}>
//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             size="large"
//             loading={form.loading}
//           >
//             {t('login.button')}
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Button icon={<GoogleOutlined />} block size="large">
//             {t('login.google')}
//           </Button>
//         </Form.Item>
//       </Form>
//     </Flex>
//   );
// };

export const LoginForm: React.FC = () => {
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}