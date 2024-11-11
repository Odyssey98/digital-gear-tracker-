import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './config';  // 导入i18n配置
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
