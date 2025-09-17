import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { handleApiError } from '@/utils/api';
import type { User, LoginCredentials } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.warn('사용자 정보 새로고침 실패:', error);
      // 토큰이 유효하지 않으면 제거
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authApi.login(credentials);
      setUser(userData);
    } catch (error) {
      const apiError = handleApiError(error);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('로그아웃 API 호출 실패:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // 초기 로드시 토큰으로 사용자 정보 확인
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  // 토큰 만료 감지를 위한 인터벌 (선택적)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshUser().catch(() => {
        // 자동 새로고침 실패시 조용히 무시
      });
    }, 15 * 60 * 1000); // 15분마다 확인

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUser]);

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
