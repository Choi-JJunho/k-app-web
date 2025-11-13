import { useState } from "react";
import { Link } from "react-router-dom";
import { useMeals } from "@/hooks/useMeals";
import { useAuth } from "@/contexts/AuthContext";
import MealFilters from "@/components/meal/MealFilters";
import MealCard from "@/components/meal/MealCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useMeals(selectedDate);
  const meals = data || [];

  const filteredMeals =
    selectedTime === "all"
      ? meals
      : meals.filter((meal) => meal.dining_time === selectedTime);

  const handleRetry = () => {
    refetch();
  };

  const handleDateChange = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  };

  return (
    <>
      {user ? (
        <>
          <div className="bg-white/80 backdrop-blur-md border-b border-orange-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  🍱 오늘의 식단
                </h1>
              </div>

              <MealFilters
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-4">
            {isLoading && (
              <LoadingSpinner
                size="lg"
                message="맛있는 식단을 불러오는 중..."
              />
            )}

            {error && (
              <ErrorState
                icon="🚫"
                title="식단 정보를 불러올 수 없어요"
                description={error}
                onRetry={handleRetry}
              />
            )}

            {!isLoading && !error && (
              <div className="space-y-4">
                {filteredMeals.length === 0 ? (
                  <EmptyState
                    icon="🍽️"
                    title="선택한 조건의 식단이 없어요"
                    description="다른 날짜나 시간대를 선택해보세요"
                    action={
                      selectedDate !==
                        new Date().toISOString().split("T")[0] && (
                        <button
                          onClick={handleDateChange}
                          className="px-4 py-2 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 transition-colors"
                        >
                          오늘로 이동
                        </button>
                      )
                    }
                  />
                ) : (
                  filteredMeals.map((meal, index) => (
                    <MealCard
                      key={`${meal.date}-${meal.dining_time}-${index}`}
                      meal={meal}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🍱</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              K-Food에 오신 것을 환영합니다
            </h1>
            <p className="text-gray-600 mb-8">
              맛있는 식단 정보를 확인하고 영양 정보를 관리해보세요
            </p>
            <Link
              to="/auth/login"
              className="inline-block px-8 py-3 bg-orange-400 text-white rounded-xl font-medium hover:bg-orange-500 transition-colors shadow-lg"
            >
              로그인하여 시작하기
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
