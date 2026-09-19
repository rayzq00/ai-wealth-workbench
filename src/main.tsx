import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorInfo: '#1677ff',
          colorSuccess: '#329a7b',
          colorWarning: '#e39a42',
          colorError: '#e55968',
          colorText: '#25283b',
          colorTextSecondary: '#657185',
          colorBgLayout: '#f7f8fa',
          colorBorderSecondary: '#ececf3',
          borderRadius: 8,
          borderRadiusLG: 8,
          fontFamily: "Inter, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          fontSize: 14,
          boxShadowSecondary: '0 4px 16px rgba(26, 27, 55, 0.05)',
        },
        components: {
          Button: { controlHeight: 36, primaryShadow: 'none' },
          Card: { paddingLG: 24 },
          Input: { controlHeight: 36 },
          Select: { controlHeight: 36 },
          Segmented: { trackBg: '#f1f1f7' },
          Drawer: { zIndexPopup: 1100 },
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
