import { useState, useEffect, useCallback } from "react";

interface Meal {
  date: string;
  dining_time: string;
  place: string;
  price: string;
  kcal: string;
  menu: string[];
}

interface UseMealsReturn {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMeals(date: string): UseMealsReturn {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    if (!date) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/meals?date=${date}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMeals(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "데이터를 가져오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    loading,
    error,
    refetch: fetchMeals,
  };
}
