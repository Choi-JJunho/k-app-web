-- K-Food 식단 정보 테이블 생성 쿼리
-- PostgreSQL용 DDL

-- 식단 정보 테이블
CREATE TABLE meals (
    id BIGINT PRIMARY KEY,
    date DATE NOT NULL,
    dining_time VARCHAR(20) NOT NULL,
    place VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    kcal INTEGER NOT NULL DEFAULT 0,
    menu TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_meals_date ON meals (date);
CREATE INDEX idx_meals_dining_time ON meals (dining_time);
CREATE INDEX idx_meals_place ON meals (place);
CREATE INDEX idx_meals_date_dining_time ON meals (date, dining_time);

-- 테이블 코멘트
COMMENT ON TABLE meals IS '식단 정보를 저장하는 테이블';
COMMENT ON COLUMN meals.id IS '고유 식별자 (Primary Key)';
COMMENT ON COLUMN meals.date IS '식단 제공 날짜';
COMMENT ON COLUMN meals.dining_time IS '식사 시간 (breakfast, lunch, dinner)';
COMMENT ON COLUMN meals.place IS '식당/코너명';
COMMENT ON COLUMN meals.price IS '가격 (원 단위)';
COMMENT ON COLUMN meals.kcal IS '칼로리';
COMMENT ON COLUMN meals.menu IS '메뉴 목록 (배열)';
COMMENT ON COLUMN meals.created_at IS '레코드 생성 시간';
COMMENT ON COLUMN meals.updated_at IS '레코드 수정 시간';

-- 샘플 데이터 삽입 (테스트용)
INSERT INTO meals (date, dining_time, place, price, kcal, menu) VALUES
('2025-01-01', 'lunch', 'Korean Food (한식)', 5000, 885, 
 ARRAY['혼합잡곡밥＆흰밥', '(탕)사골왕만두떡국', '제육김치볶음', '매콤두부조림', '깍두기']),
('2025-01-01', 'dinner', 'Korean Food (한식)', 5000, 880, 
 ARRAY['혼합잡곡밥＆흰밥', '북어채무국', '눈꽃치즈닭갈비', '간장진미채조림', '양념구이김', '배추김치']),
('2025-01-02', 'breakfast', 'Korean Food (한식)', 5000, 780, 
 ARRAY['혼합잡곡밥＆흰밥', '감자고추장국', '소고기야채굴소스볶음', '두부조림', '양념구이김', '배추김치']);

-- 데이터 조회 예시 쿼리
/*
-- 특정 날짜 식단 조회
SELECT * FROM meals WHERE date = '2025-01-01' ORDER BY dining_time;

-- 점심 메뉴만 조회
SELECT * FROM meals WHERE dining_time = 'lunch' ORDER BY date DESC;

-- 특정 식당의 메뉴 조회
SELECT * FROM meals WHERE place LIKE '%한식%' ORDER BY date DESC;

-- 가격대별 조회
SELECT * FROM meals WHERE price BETWEEN 5000 AND 6000 ORDER BY price;

-- 칼로리 높은 순으로 조회
SELECT * FROM meals WHERE date >= '2025-01-01' ORDER BY kcal DESC LIMIT 10;

-- 메뉴에 특정 음식이 포함된 식단 조회
SELECT * FROM meals WHERE '제육김치볶음' = ANY(menu);

-- 날짜별 식단 개수 조회
SELECT date, COUNT(*) as meal_count 
FROM meals 
GROUP BY date 
ORDER BY date DESC;

-- 식당별 평균 칼로리 조회
SELECT place, AVG(kcal) as avg_kcal, COUNT(*) as meal_count
FROM meals 
GROUP BY place 
ORDER BY avg_kcal DESC;
*/