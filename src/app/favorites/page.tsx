"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

interface FavoriteMeal {
  id: string;
  name: string;
  place: string;
  price: string;
  kcal: string;
  rating: number;
  lastSeen: string;
  frequency: number;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "korean" | "onedish" | "special">("all");

  // Mock data - 실제로는 사용자의 즐겨찾기 데이터
  const [favorites] = useState<FavoriteMeal[]>([
    {
      id: "1",
      name: "안동찜닭",
      place: "Korean Food (한식)",
      price: "5000",
      kcal: "881",
      rating: 5,
      lastSeen: "2025-01-03",
      frequency: 12
    },
    {
      id: "2", 
      name: "돈까스",
      place: "Korean Food (한식)",
      price: "5000",
      kcal: "883",
      rating: 4,
      lastSeen: "2025-01-04",
      frequency: 8
    },
    {
      id: "3",
      name: "치킨마요덮밥",
      place: "Onedish Food (일품)",
      price: "5000", 
      kcal: "884",
      rating: 5,
      lastSeen: "2025-01-09",
      frequency: 6
    },
    {
      id: "4",
      name: "짜장면",
      place: "코너1",
      price: "6000",
      kcal: "885",
      rating: 4,
      lastSeen: "2025-02-05",
      frequency: 15
    }
  ]);

  const categories = {
    all: "전체",
    korean: "한식",
    onedish: "일품",
    special: "특식"
  };

  const filteredFavorites = selectedCategory === "all" 
    ? favorites
    : favorites.filter(meal => {
        if (selectedCategory === "korean") return meal.place.includes("한식");
        if (selectedCategory === "onedish") return meal.place.includes("일품");
        if (selectedCategory === "special") return meal.place.includes("특식");
        return true;
      });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ⭐
      </span>
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다</p>
          <a
            href="/auth/login"
            className="px-4 py-2 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 transition-colors"
          >
            로그인하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <main className="pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">❤️ 즐겨찾기</h1>
            <div className="text-sm text-gray-600">
              {favorites.length}개의 메뉴
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-1">🍽️</div>
              <p className="text-lg font-bold text-orange-600">{favorites.length}</p>
              <p className="text-xs text-gray-500">즐겨찾는 메뉴</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-lg font-bold text-yellow-600">
                {favorites.find(f => f.rating === 5)?.name.slice(0, 6) || "없음"}
              </p>
              <p className="text-xs text-gray-500">최고 평점</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-1">🔄</div>
              <p className="text-lg font-bold text-blue-600">
                {Math.max(...favorites.map(f => f.frequency))}회
              </p>
              <p className="text-xs text-gray-500">최다 섭취</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-1">📅</div>
              <p className="text-lg font-bold text-green-600">
                {new Date(Math.max(...favorites.map(f => new Date(f.lastSeen).getTime())))
                  .toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-gray-500">최근 섭취</p>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as typeof selectedCategory)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedCategory === key
                    ? "bg-orange-400 text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 즐겨찾기 목록 */}
          <div className="space-y-4">
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-60">🍽️</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  즐겨찾기가 비어있어요
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  마음에 드는 메뉴를 즐겨찾기에 추가해보세요
                </p>
                <a
                  href="/"
                  className="inline-block px-4 py-2 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 transition-colors"
                >
                  식단 보러가기
                </a>
              </div>
            ) : (
              filteredFavorites
                .sort((a, b) => b.frequency - a.frequency) // 빈도순 정렬
                .map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {meal.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              📍 {meal.place}
                            </span>
                            <span className="flex items-center gap-1">
                              💰 {meal.price}원
                            </span>
                            <span className="flex items-center gap-1">
                              🔥 {meal.kcal}kcal
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(meal.rating)}</div>
                            <span className="text-sm text-gray-500">
                              ({meal.rating}/5)
                            </span>
                          </div>
                        </div>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <span className="text-gray-600">
                            🔄 {meal.frequency}회 섭취
                          </span>
                          <span className="text-gray-600">
                            📅 최근: {new Date(meal.lastSeen).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                            알림 설정
                          </button>
                          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                            공유
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* 추천 섹션 */}
          {favorites.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span>
                맞춤 추천
              </h2>
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">이런 메뉴는 어떠세요?</h3>
                <p className="text-sm text-gray-700 mb-3">
                  자주 드시는 <strong>안동찜닭</strong>과 비슷한 메뉴들을 추천드려요!
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700">
                    닭갈비
                  </span>
                  <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700">
                    찜닭
                  </span>
                  <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700">
                    닭볶음탕
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}