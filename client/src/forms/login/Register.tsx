// import React, { useContext } from 'react';

// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

// import { Button, Form, Input, Typography, notification, Flex } from 'antd';
// import { LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';

// import { LoginModel, UserModel } from '../../api';
// import { EMAIL_REGEX } from '../../utils/regex';
// import { FormControl, useFormDPO } from '../../utils/form';
// import { CLIENT_URL } from '../../config';
// import { debounce } from 'lodash';
// import { AuthContext, ProjectsContext } from '../../Wrappers';

// export const RegisterForm: React.FC = () => {
//   const { t } = useTranslation('common');
//   const nav = useNavigate();
//   const form = useFormDPO(new FormControl('username', 'email', 'password'));
//   const { refetch: refetchAuth } = useContext(AuthContext);
//   const { refetch: refetchProjects } = useContext(ProjectsContext);

//   const onSubmit = (values: any) => {
//     form.clearErrors();
//     form.startLoading();
//     LoginModel.register(values.username, values.email, values.password)
//       .then((token) => {
//         form.endLoading();
//         localStorage.setItem('token', token);
//         nav('/home');
//         refetchAuth();
//         refetchProjects();
//       })
//       .catch((err: Error) => {
//         form.endLoading();
//         if (err.message === 'USERNAME_ALREADY_EXISTS') {
//           form.setError('username', t('register.errors.username-taken'));
//           return;
//         }
//         if (err.message === 'USERNAME_MUST_BE_ALPHANUMERIC') {
//           form.setError('username', t('register.errors.alphanumeric-username'));
//           return;
//         }
//         if (err.message === 'INVALID_EMAIL') {
//           form.setError('email', t('register.errors.invalid-email'));
//           return;
//         }
//         if (err.message === 'EMAIL_ALREADY_EXISTS') {
//           form.setError('email', t('register.errors.email-taken'));
//           return;
//         }
//         if (err.message === 'PASSWORD_MUST_CONTAIN_8_TO_30_CHARACTERS') {
//           form.setError('password', t('register.errors.weak-password'));
//           return;
//         }
//         notification.error({
//           message: t('register.errors.generic'),
//           description: err.message,
//         });
//       });
//   };

//   const checkUsername = debounce((e: any) => {
//     UserModel.checkUsername(e.target.value)
//       .then((available) => {
//         available
//           ? form.clearErrors('username')
//           : form.setError('username', t('register.errors.username-taken'));
//       })
//       .catch((err: Error) => {
//         console.log(err.message);
//       });
//   }, 250);

//   const checkEmail = (e: any) => {
//     EMAIL_REGEX.test(e.target.value)
//       ? form.clearErrors('email')
//       : form.setError('email', t('register.errors.invalid-email'));
//   };

//   return (
//     <Flex
//       justify="center"
//       align="center"
//       style={{ height: '100%', width: '100%' }}
//     >
//       <Form
//         name="register"
//         onFinish={onSubmit}
//         layout="vertical"
//         style={{ width: '27.5%' }}
//       >
//         <Flex vertical align="center">
//           <Typography.Title level={2} style={{ margin: 4 }}>
//             {t('register.title')}
//           </Typography.Title>
//           <Typography.Paragraph style={{ fontSize: '18px' }}>
//             {t('register.subtitle')}
//             <Typography.Link
//               onClick={() => nav('/login')}
//               underline
//               style={{ fontSize: '18px', marginLeft: 6 }}
//             >
//               {t('register.subtitle-action')}
//             </Typography.Link>
//           </Typography.Paragraph>
//         </Flex>
//         <Form.Item
//           label={t('register.username')}
//           name="username"
//           rules={[
//             { required: true, message: t('register.errors.username-required') },
//           ]}
//           {...form.errors.username.message}
//         >
//           <Input
//             placeholder={t('register.username-placeholder')}
//             onChange={checkUsername}
//             addonBefore={CLIENT_URL + '/'}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           label={t('register.email')}
//           name="email"
//           rules={[
//             { required: true, message: t('register.errors.email-required') },
//           ]}
//           {...form.errors.email.message}
//         >
//           <Input
//             prefix={<MailOutlined className="site-form-item-icon" />}
//             placeholder={t('register.email-placeholder')}
//             onChange={checkEmail}
//             size="large"
//           />
//         </Form.Item>
//         <Form.Item
//           label={t('register.password')}
//           name="password"
//           rules={[
//             { required: true, message: t('register.errors.password-required') },
//           ]}
//           {...form.errors.password}
//         >
//           <Input.Password
//             prefix={<LockOutlined className="site-form-item-icon" />}
//             placeholder={t('register.password-placeholder')}
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
//             {t('register.button')}
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Button icon={<GoogleOutlined />} block size="large">
//             {t('register.google')}
//           </Button>
//         </Form.Item>
//       </Form>
//     </Flex>
//   );
// };

export const RegisterForm: React.FC = () => {
  return <div>Register Form</div>;
}