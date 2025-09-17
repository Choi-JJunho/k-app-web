import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import HomePage from '@/pages/HomePage';
import NutritionPage from '@/pages/NutritionPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import './app/globals.css';

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 에러 로깅 서비스로 전송 (예: Sentry, LogRocket 등)
        console.error('Application Error:', error, errorInfo);
      }}
    >
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pb-20 md:pb-0">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/nutrition" element={<NutritionPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <BottomNavigation />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}