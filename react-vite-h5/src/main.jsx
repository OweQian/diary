import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'lib-flexible/flexible'
import './index.css'
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import 'zarm/dist/zarm.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN} primaryColor="#007fff">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>
)
