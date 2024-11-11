import i18n from 'i18next';

// 简单的调试工具
export const i18nDebug = {
  // 切换语言
  toEnglish: () => i18n.changeLanguage('en-US'),
  toChinese: () => i18n.changeLanguage('zh-CN'),
  
  // 查看当前状态
  status: () => ({
    current: i18n.language,
    browser: navigator.language,
  }),
  
  // 测试翻译
  test: (key: string) => ({
    key,
    zh: i18n.getFixedT('zh-CN')(key),
    en: i18n.getFixedT('en-US')(key),
  })
};

// 开发环境下挂载到 window
if (import.meta.env.DEV) {
  window.i18nDebug = i18nDebug;
}

// TypeScript 类型声明
declare global {
  interface Window {
    i18nDebug: typeof i18nDebug;
  }
}