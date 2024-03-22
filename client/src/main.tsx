import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider, App as AntApp } from 'antd';

import './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider theme={{ token: { colorPrimary: '#000000' } }}>
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>
);
