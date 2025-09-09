"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

interface NutritionData {
  date: string;
  totalCalories: number;
  meals: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
}

export default function NutritionPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);

  // Mock data - 실제로는 API에서 가져와야 함
  useEffect(() => {
    const mockData: NutritionData[] = [
      {
        date: "2025-01-01",
        totalCalories: 2245,
        meals: { breakfast: 0, lunch: 885, dinner: 880 }
      },
      {
        date: "2025-01-02",
        totalCalories: 2536,
        meals: { breakfast: 780, lunch: 878, dinner: 878 }
      },
      {
        date: "2025-01-03",
        totalCalories: 2546,
        meals: { breakfast: 782, lunch: 881, dinner: 881 }
      },
      {
        date: "2025-01-04",
        totalCalories: 1748,
        meals: { breakfast: 0, lunch: 883, dinner: 884 }
      },
      {
        date: "2025-01-05",
        totalCalories: 1754,
        meals: { breakfast: 0, lunch: 877, dinner: 877 }
      }
    ];
    setNutritionData(mockData);
  }, []);

  const totalWeekCalories = nutritionData.reduce((sum, day) => sum + day.totalCalories, 0);
  const avgDailyCalories = Math.round(totalWeekCalories / nutritionData.length);
  const recommendedCalories = 2200; // 권장 칼로리

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
            <h1 className="text-2xl font-bold text-gray-800">📊 영양정보</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod("week")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === "week"
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                주간
              </button>
              <button
                onClick={() => setSelectedPeriod("month")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === "month"
                    ? "bg-orange-400 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                월간
              </button>
            </div>
          </div>

          {/* 칼로리 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">일일 평균</h3>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{avgDailyCalories}</p>
              <p className="text-xs text-gray-500">kcal/일</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">권장 대비</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((avgDailyCalories / recommendedCalories) * 100)}%
              </p>
              <p className="text-xs text-gray-500">목표 달성률</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">총 섭취</h3>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{totalWeekCalories.toLocaleString()}</p>
              <p className="text-xs text-gray-500">kcal (주간)</p>
            </div>
          </div>

          {/* 일일 칼로리 차트 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">일일 칼로리 추이</h2>
            <div className="space-y-4">
              {nutritionData.map((day, index) => (
                <div key={day.date} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600 font-medium">
                    {new Date(day.date).toLocaleDateString("ko-KR", { 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {day.totalCalories}kcal
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((day.totalCalories / recommendedCalories) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {day.meals.breakfast > 0 && (
                        <div 
                          className="bg-blue-300 h-1 rounded"
                          style={{
                            width: `${(day.meals.breakfast / day.totalCalories) * 100}%`
                          }}
                          title={`조식: ${day.meals.breakfast}kcal`}
                        />
                      )}
                      {day.meals.lunch > 0 && (
                        <div 
                          className="bg-orange-300 h-1 rounded"
                          style={{
                            width: `${(day.meals.lunch / day.totalCalories) * 100}%`
                          }}
                          title={`중식: ${day.meals.lunch}kcal`}
                        />
                      )}
                      {day.meals.dinner > 0 && (
                        <div 
                          className="bg-purple-300 h-1 rounded"
                          style={{
                            width: `${(day.meals.dinner / day.totalCalories) * 100}%`
                          }}
                          title={`석식: ${day.meals.dinner}kcal`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-300 rounded"></div>
                <span className="text-xs text-gray-600">조식</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-300 rounded"></div>
                <span className="text-xs text-gray-600">중식</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-300 rounded"></div>
                <span className="text-xs text-gray-600">석식</span>
              </div>
            </div>
          </div>

          {/* 영양 성분 분석 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">영양성분 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl mb-2">🍖</div>
                <h3 className="font-semibold text-gray-800">단백질</h3>
                <p className="text-xl font-bold text-red-600">18%</p>
                <p className="text-xs text-gray-500">일일 권장량 대비</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl mb-2">🍞</div>
                <h3 className="font-semibold text-gray-800">탄수화물</h3>
                <p className="text-xl font-bold text-yellow-600">65%</p>
                <p className="text-xs text-gray-500">일일 권장량 대비</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl mb-2">🥑</div>
                <h3 className="font-semibold text-gray-800">지방</h3>
                <p className="text-xl font-bold text-blue-600">17%</p>
                <p className="text-xs text-gray-500">일일 권장량 대비</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">💡</span>
                <h3 className="font-semibold text-green-800">영양 팁</h3>
              </div>
              <p className="text-sm text-green-700">
                단백질 섭취가 조금 부족합니다. 육류나 두부 요리를 더 드시는 것을 권장합니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}