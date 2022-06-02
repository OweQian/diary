import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import App from './App'
import 'lib-flexible/flexible'
import './index.css'
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import 'zarm/dist/zarm.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN} primaryColor="#007fff">
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </ConfigProvider>
)
