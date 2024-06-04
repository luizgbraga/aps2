import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider, App as AntApp } from 'antd';

import './styles/dashboard.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = {
  token: {
    colorPrimary: '#1560BD'
  },
  components: {
    Table: {
      borderColor: '#b7b7b7'
    },
  },
}

root.render(
  <ConfigProvider theme={theme}>
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>
);
