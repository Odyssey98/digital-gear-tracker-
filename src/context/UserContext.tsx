import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

interface UserContextType {
  user: User | null;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('id', user.id)
          .maybeSingle();

        if (error || !data) {
          setUser(null);
          toast.error('会话已过期，请重新登录');
        }
      }
    } catch (error) {
      console.error('Check user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, password: string) => {
    try {
      setLoading(true);
      
      // 检查用户名是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('name', name.trim())
        .maybeSingle();

      if (existingUser) {
        throw new Error('该用户名已被注册');
      }

      const now = new Date().toISOString();
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          id: crypto.randomUUID(),
          name: name.trim(),
          password: password,  // 存储密码
          created_at: now,
          last_login: now
        })
        .select()
        .single();

      if (error) throw error;
      setUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const login = async (name: string, password: string) => {
    try {
      setLoading(true);
      
      // 先检查用户名是否存在
      const { data: userExists, error: searchError } = await supabase
        .from('users')
        .select('name')
        .eq('name', name.trim())
        .maybeSingle();

      console.log('Search result:', { userExists, searchError });

      if (!userExists) {
        throw new Error('用户名不存在，请先注册');
      }

      // 检查密码
      const { data: user, error: loginError } = await supabase
        .from('users')
        .select('*')
        .eq('name', name.trim())
        .eq('password', password)
        .maybeSingle();

      console.log('Login result:', { user, loginError });

      if (!user) {
        throw new Error('密码错误');
      }

      // 更新登录时间
      const now = new Date().toISOString();
      await supabase
        .from('users')
        .update({ last_login: now })
        .eq('id', user.id);

      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await supabase
          .from('users')
          .update({ last_logout: new Date().toISOString() })
          .eq('id', user.id);
      }
      setUser(null);
      toast.success('已安全退出');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};