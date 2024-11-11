import { useState } from 'react';
import { PenTool, Languages } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

function LoginModal() {
  const { t, i18n } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return t('login.errors.passwordLength');
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return t('login.errors.passwordFormat');
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
      if (!name.trim()) {
        toast.error(t('login.errors.usernameRequired'));
        setIsLoading(false);
        return;
      }
      if (!password) {
        toast.error(t('login.errors.passwordRequired'));
        setIsLoading(false);
        return;
      }

      if (isRegister) {
        if (name.trim().length < 2) {
          toast.error(t('login.errors.usernameLength'));
          setIsLoading(false);
          return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          toast.error(passwordError);
          setIsLoading(false);
          return;
        }

        if (!confirmPassword) {
          toast.error(t('login.errors.confirmPasswordRequired'));
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error(t('login.errors.passwordMismatch'));
          setIsLoading(false);
          return;
        }

        await register(name.trim(), password);
        toast.success(t('login.errors.registerSuccess'));
        setIsRegister(false);
        resetForm();
      } else {
        try {
          await login(name.trim(), password);
          toast.success(t('login.errors.loginSuccess'));
          resetForm();
        } catch (loginError) {
          if (loginError instanceof Error) {
            toast.error(loginError.message);
          } else {
            toast.error(t('login.errors.loginFailed'));
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t(isRegister ? 'login.errors.registerFailed' : 'login.errors.loginFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = 
    isLoading || 
    !name.trim() || 
    !password || 
    (isRegister && (!confirmPassword || password !== confirmPassword));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-lg">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <Languages className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <PenTool className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">{t('login.title')}</h2>
          <p className="text-sm text-gray-500 mt-2">{t('login.slogan')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('login.username')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t(isRegister ? 'login.placeholders.usernameRegister' : 'login.placeholders.usernameLogin')}
              required
              disabled={isLoading}
              minLength={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t(isRegister ? 'login.placeholders.passwordRegister' : 'login.placeholders.passwordLogin')}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('login.confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t('login.placeholders.confirmPassword')}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('login.passwordRequirement')}
              </p>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            {isLoading ? t('login.processing') : t(isRegister ? 'login.register' : 'login.login')}
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
            {t(isRegister ? 'login.hasAccount' : 'login.noAccount')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;