import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailPrefix || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const fullEmail = `${emailPrefix}@koreatech.ac.kr`;

    try {
      await login({ email: fullEmail, password });
      navigate("/"); // 로그인 후 메인 페이지로 리다이렉트
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="로그인 중..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🍱</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            K-Food 로그인
          </h1>
          <p className="text-gray-600">맛있는 식단 정보를 확인해보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              학교 이메일
            </label>
            <div className="relative">
              <input
                id="email"
                type="text"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value)}
                className="w-full p-3 pr-40 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                placeholder="사용자명"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 text-sm">@koreatech.ac.kr</span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <Link
              to="/auth/register"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}