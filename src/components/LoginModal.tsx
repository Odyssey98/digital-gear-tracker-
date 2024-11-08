import { useState } from 'react';
import { PenTool } from 'lucide-react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

function LoginModal() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return '密码长度至少需要6位';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return '密码需要包含字母和数字';
    }
    return null;
  };

  const resetForm = () => {
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 基础验证
      if (!name.trim()) {
        toast.error('请输入用户名');
        setIsLoading(false);
        return;
      }
      if (!password) {
        toast.error('请输入密码');
        setIsLoading(false);
        return;
      }

      if (isRegister) {
        // 注册时的验证
        if (name.trim().length < 2) {
          toast.error('用户名至少需要2个字符');
          setIsLoading(false);
          return;
        }

        // 使用 validatePassword 函数验证密码格式
        const passwordError = validatePassword(password);
        if (passwordError) {
          toast.error(passwordError);
          setIsLoading(false);
          return;
        }

        if (!confirmPassword) {
          toast.error('请确认密码');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error('两次输入的密码不一致');
          setIsLoading(false);
          return;
        }

        await register(name.trim(), password);
        toast.success('注册成功！');
        setIsRegister(false);
        resetForm();
      } else {
        console.log('Attempting login...');
        try {
          await login(name.trim(), password);
          console.log('Login successful');
          toast.success('登录成功！');
          resetForm();
        } catch (loginError) {
          console.log('Login failed:', loginError);
          if (loginError instanceof Error) {
            toast.error(loginError.message);
          } else {
            toast.error('登录失败');
          }
        }
      }
    } catch (error) {
      console.log('Outer catch:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(isRegister ? '注册失败' : '登录失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 添加按钮禁用条件
  const isSubmitDisabled = 
    isLoading || 
    !name.trim() || 
    !password || 
    (isRegister && (!confirmPassword || password !== confirmPassword));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <PenTool className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">用时宝</h2>
          <p className="text-sm text-gray-500 mt-2">让数据告诉你每天的电子产品使用成本</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={isRegister ? "至少2个字符" : "请输入用户名"}
              required
              disabled={isLoading}
              minLength={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={isRegister ? "至少6位，包含字母和数字" : "请输入密码"}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请再次输入密码"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                密码要求：至少6位，必须包含字母和数字
              </p>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            {isLoading ? '处理中...' : (isRegister ? '注册' : '登录')}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setPassword('');
              setConfirmPassword('');
            }}
            className="w-full text-indigo-600 text-sm hover:underline"
          >
            {isRegister ? '已有账号？点击登录' : '没有账号？点击注册'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;