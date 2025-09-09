// /app/api/meals/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Meal {
  date: string;
  dining_time: string;
  place: string;
  price: string;
  kcal: string;
  menu: string[];
}

// 나중에 실제 크롤링 로직으로 대체될 함수
const fetchMealsFromSource = async (date: string): Promise<Meal[]> => {
  // TODO: 여기에 실제 크롤링 또는 DB 조회 로직을 구현합니다.
  console.log(`Fetching meals for date: ${date}`);

  try {
    // JSON 파일에서 데이터 읽기
    const filePath = path.join(process.cwd(), "koreatech_meals_2025.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const allMeals: Meal[] = JSON.parse(fileContent);

    // 요청된 날짜의 데이터만 필터링
    const mealsForDate = allMeals.filter((meal: Meal) => meal.date === date);

    return mealsForDate;
  } catch (error) {
    console.error("Error reading meal data:", error);
    // 파일을 읽을 수 없는 경우 빈 배열 반환
    return [];
  }
};

/**
 * 지정된 날짜의 급식 메뉴를 조회하는 API
 * @param req - NextRequest 객체
 * @returns 날짜와 식당별 메뉴 정보를 담은 JSON 응답
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "날짜를 YYYY-MM-DD 형식으로 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchMealsFromSource(date);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "데이터를 가져오는 중 서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
