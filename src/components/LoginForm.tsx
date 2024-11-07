import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthError } from '@supabase/supabase-js';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
  }>({});
  const { login, signup } = useAuth();
  const [emailSentTimer, setEmailSentTimer] = useState(0);

  // 添加倒计时效果
  useEffect(() => {
    if (emailSentTimer > 0) {
      const timer = setInterval(() => {
        setEmailSentTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [emailSentTimer]);

  // 验证邮箱格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return '邮箱不能为空';
    }
    if (!emailRegex.test(email)) {
      return '请输入有效的邮箱地址';
    }
    return '';
  };

  // 验证密码强度
  const validatePassword = (password: string) => {
    if (!password) {
      return '密码不能为空';
    }
    if (password.length < 6) {
      return '密码长度至少为6位';
    }
    if (!/[A-Z]/.test(password)) {
      return '密码必须包含至少一个大写字母';
    }
    if (!/[a-z]/.test(password)) {
      return '密码必须包含至少一个小写字母';
    }
    if (!/[0-9]/.test(password)) {
      return '密码必须包含至少一个数字';
    }
    return '';
  };

  // 验证用户名
  const validateUsername = (username: string) => {
    if (!username) {
      return '用户名不能为空';
    }
    if (username.length < 3) {
      return '用户名长度至少为3位';
    }
    if (username.length > 20) {
      return '用户名长度不能超过20位';
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return '用户名只能包含字母、数字、下划线和中文';
    }
    return '';
  };

  // 实时验证
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailError = validateEmail(newEmail);
    setValidationErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordError = validatePassword(newPassword);
    setValidationErrors(prev => ({ ...prev, password: passwordError }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    const usernameError = validateUsername(newUsername);
    setValidationErrors(prev => ({ ...prev, username: usernameError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 检查是否在冷却时间内
    if (!isLogin && emailSentTimer > 0) {
      setError(`请等待 ${emailSentTimer} 秒后再次尝试注册`);
      return;
    }

    // 提交前验证
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const usernameError = !isLogin ? validateUsername(username) : '';

    const newValidationErrors = {
      email: emailError,
      password: passwordError,
      username: usernameError,
    };

    setValidationErrors(newValidationErrors);

    // 如果有验证错误，阻止提交
    if (emailError || passwordError || (!isLogin && usernameError)) {
      return;
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, username);
        // 设置60秒冷却时间
        setEmailSentTimer(60);
        toast.success('注册邮件已发送，请查收邮箱完成验证');
      }
    } catch (err: unknown) {
      const error = err as AuthError;
      
      if (error?.message?.includes('over_email_send_rate_limit')) {
        const seconds = error.message.match(/\d+/)?.[0] || '60';
        setEmailSentTimer(parseInt(seconds));
        setError(`发送太频繁，请等待 ${seconds} 秒后重试`);
      } else {
        setError(isLogin ? '登录失败，请检查邮箱和密码' : '注册失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? '登录账户' : '注册账户'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? '登录以管理您的电子产品' : '创建账户开始管理您的电子产品'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={handleUsernameChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.username && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.username}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
              )}
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">
                  密码必须包含至少6个字符，包括大小写字母和数字
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isLogin && emailSentTimer > 0}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${!isLogin && emailSentTimer > 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
            >
              {isLogin 
                ? '登录' 
                : emailSentTimer > 0 
                  ? `请等待 ${emailSentTimer} 秒` 
                  : '注册'
              }
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setValidationErrors({});
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? '没有账户？点击注册' : '已有账户？点击登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;