import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user.name}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">
              이번 주 식사
            </h3>
            <p className="text-2xl font-bold text-orange-600">12회</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">즐겨찾기</h3>
            <p className="text-2xl font-bold text-blue-600">5개</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">설정</h2>
        <div className="space-y-3">
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <span>알림 설정</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <span>식단 선호도 설정</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
            <span>계정 설정</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          계정 관리
        </h2>
        <div className="space-y-3">
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
            개인정보 수정
          </button>
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
            이용약관
          </button>
          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
            개인정보처리방침
          </button>
          <button
            onClick={logout}
            className="w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}