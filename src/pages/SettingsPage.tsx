import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    mealReminder: true,
    favoriteAvailable: true,
    nutritionTips: false,
    weeklyReport: true
  });
  
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "ko",
    defaultView: "today",
    showCalories: true,
    showPrice: true
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다</p>
          <Link
            to="/auth/login"
            className="px-4 py-2 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">⚙️ 설정</h1>

      {/* 알림 설정 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔔</span>
          알림 설정
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">식사 시간 알림</h3>
              <p className="text-sm text-gray-600">식사 시간 30분 전에 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleNotificationChange('mealReminder')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.mealReminder ? 'bg-orange-400' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications.mealReminder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">즐겨찾기 메뉴 알림</h3>
              <p className="text-sm text-gray-600">즐겨찾는 메뉴가 나올 때 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleNotificationChange('favoriteAvailable')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.favoriteAvailable ? 'bg-orange-400' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications.favoriteAvailable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">영양 팁</h3>
              <p className="text-sm text-gray-600">건강한 식단을 위한 팁을 받습니다</p>
            </div>
            <button
              onClick={() => handleNotificationChange('nutritionTips')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.nutritionTips ? 'bg-orange-400' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications.nutritionTips ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">주간 리포트</h3>
              <p className="text-sm text-gray-600">주간 식단 분석 리포트를 받습니다</p>
            </div>
            <button
              onClick={() => handleNotificationChange('weeklyReport')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.weeklyReport ? 'bg-orange-400' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 앱 설정 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🎨</span>
          앱 설정
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">테마</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handlePreferenceChange('theme', 'light')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.theme === 'light'
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                라이트
              </button>
              <button
                onClick={() => handlePreferenceChange('theme', 'dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.theme === 'dark'
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                다크
              </button>
              <button
                onClick={() => handlePreferenceChange('theme', 'auto')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.theme === 'auto'
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                자동
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">기본 화면</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handlePreferenceChange('defaultView', 'today')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.defaultView === 'today'
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                오늘
              </button>
              <button
                onClick={() => handlePreferenceChange('defaultView', 'week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  preferences.defaultView === 'week'
                    ? 'bg-orange-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                주간
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">칼로리 표시</span>
              <button
                onClick={() => handlePreferenceChange('showCalories', !preferences.showCalories)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.showCalories ? 'bg-orange-400' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.showCalories ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">가격 표시</span>
              <button
                onClick={() => handlePreferenceChange('showPrice', !preferences.showPrice)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.showPrice ? 'bg-orange-400' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.showPrice ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 계정 설정 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>👤</span>
          계정 설정
        </h2>
        <div className="space-y-3">
          <button className="w-full p-4 text-left hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">개인정보 수정</h3>
              <p className="text-sm text-gray-600">프로필 사진, 이름, 이메일 수정</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full p-4 text-left hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">비밀번호 변경</h3>
              <p className="text-sm text-gray-600">보안을 위해 주기적으로 변경하세요</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full p-4 text-left hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">알레르기 정보</h3>
              <p className="text-sm text-gray-600">알레르기 유발 요소를 설정하세요</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full p-4 text-left hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between text-red-600">
            <div>
              <h3 className="font-medium">계정 삭제</h3>
              <p className="text-sm">모든 데이터가 영구적으로 삭제됩니다</p>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 앱 정보 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>ℹ️</span>
          앱 정보
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3">
            <span className="text-gray-600">버전</span>
            <span className="font-medium text-gray-800">1.0.0</span>
          </div>
          
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <span className="text-gray-800">이용약관</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <span className="text-gray-800">개인정보처리방침</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <span className="text-gray-800">고객지원</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm text-orange-700 text-center">
              K-Food v1.0.0 - 한국기술교육대학교 식단 서비스
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}