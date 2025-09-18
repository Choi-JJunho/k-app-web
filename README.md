# K-Food 웹 애플리케이션

한국기술교육대학교 구성원을 위한 식단·영양 정보 서비스입니다. React 19과 TypeScript, Vite를 기반으로 하며, 학교 식당 식단을 날짜/시간대별로 탐색하고 사용자 인증, 영양 통계, 프로필 관리 기능을 제공합니다.

## 주요 특징

- **최신 프런트엔드 스택**: React 19, React Router DOM 7, Tailwind CSS 4, Vite 5 기반의 모던 개발 환경
- **식단 탐색 경험**: 날짜와 시간대(조식/중식/석식) 필터, 즐겨찾기 토글, 빈 상태/에러 상태에 대한 세심한 UX
- **사용자 인증 흐름**: 로그인·회원가입 폼, JWT 토큰 저장 및 자동 새로고침을 포함한 인증 컨텍스트 관리
- **API 클라이언트 계층**: 토큰 갱신, 타임아웃, 재시도 로직이 포함된 `ApiClient`와 `useApi`/`useMutation` 훅
- **재사용 가능한 UI**: 공통 버튼, 로딩/빈/에러 상태 컴포넌트, 반응형 헤더 및 하단 내비게이션
- **확장 가능한 도메인 모듈**: 식단 카드/필터 컴포넌트, 영양 데이터 페이지, 설정/프로필 페이지 등을 모듈화

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 언어 | TypeScript |
| 프레임워크 | React 19 (Vite) |
| 라우팅 | React Router DOM 7 |
| 스타일링 | Tailwind CSS 4 |
| 상태 관리 | React Context + 커스텀 훅 |
| 날짜/유틸리티 | date-fns, 자체 유틸 함수 |
| 품질 도구 | ESLint 9 |

## 프로젝트 구조

```
├── src
│   ├── App.tsx                 # 라우팅 및 글로벌 레이아웃
│   ├── main.tsx                # React 엔트리포인트
│   ├── components              # UI 컴포넌트 모음
│   │   ├── auth                # 인증 폼 (LoginForm 등)
│   │   ├── common              # Button, ErrorBoundary
│   │   ├── form                # 폼 필드 유틸 컴포넌트
│   │   ├── layout              # Header, BottomNavigation
│   │   ├── meal                # MealCard, MealFilters
│   │   └── ui                  # EmptyState, ErrorState, LoadingSpinner, CustomDatePicker
│   ├── contexts                # AuthContext (인증 상태 보관)
│   ├── hooks                   # useApi, useMeals, useForm 등 데이터/폼 훅
│   ├── lib                     # ApiClient, API 함수 래퍼
│   ├── pages                   # Home, Nutrition, Profile, Settings, Auth 페이지
│   ├── types                   # 전역 타입 정의
│   └── utils                   # API/날짜/검증 유틸리티 함수
│
├── public                      # 정적 자산 (아이콘 등)
├── API_SPECIFICATION.md        # 백엔드 REST API 명세
├── koreatech_meals_2025.json   # 예시 식단 데이터 (크롤링 결과)
├── create_meals_table.sql      # 식단 테이블 스키마 예시
├── vite.config.js              # Vite 설정 (경로 별칭 포함)
├── tsconfig.json               # TypeScript 및 경로 별칭 설정
└── package.json                # 스크립트 및 의존성 정의
```

## API와 데이터 레이어

- `src/lib/apiClient.ts`: 토큰 저장/재발급, 타임아웃, 재시도 로직을 포함한 Fetch 기반 HTTP 클라이언트
- `src/lib/api.ts`: 인증/식단/영양 관련 API 함수 모음 (`authApi`, `mealApi`, `nutritionApi`)
- `src/hooks/useApi.ts`: 로딩/에러 상태, 재시도, 스테일 타임 등을 내장한 범용 데이터 패칭 훅
- `API_SPECIFICATION.md`: `/api/meals`, `/api/auth/*`, `/api/nutrition` 등 REST 엔드포인트 규격을 문서화
- `koreatech_meals_2025.json`: 크롤링된 2025년 식단 샘플 데이터, 목업 API 또는 개발용으로 활용 가능
- `create_meals_table.sql`: 식단 저장을 위한 MySQL 테이블 생성 스크립트 예시

## 사전 준비

- Node.js 18 이상 권장 (LTS 버전 권장)
- 패키지 매니저: `pnpm` (권장) 또는 `npm`

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (기본: http://localhost:3000)
pnpm dev

# 프로덕션 빌드 생성
pnpm build

# 프로덕션 번들 미리보기
pnpm start

# 코드 품질 검사 (ESLint)
pnpm lint
```

> `npm`을 사용하는 경우 위 명령의 `pnpm`을 `npm run` 혹은 `npx` 형태로 바꿔 실행하면 됩니다.

## 환경 변수 설정

Vite 런타임에서 사용되는 환경 변수는 `VITE_` 접두사가 필요합니다. 최소한 다음 값을 `.env` 파일에 정의하세요.

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

설정하지 않으면 기본값(`http://localhost:8000/api`)이 사용됩니다.

## 개발 가이드

- **컴포넌트 스타일링**: Tailwind CSS 유틸 클래스를 사용하며, 공통적인 패턴은 `src/components/ui`에 추출되어 있습니다.
- **상태 관리**: 전역 인증 상태는 `AuthContext`에서 관리하며, 데이터 패칭은 `useApi` 기반의 커스텀 훅을 사용합니다.
- **에러 처리**: `ErrorBoundary`와 `ErrorState` 컴포넌트를 통해 사용자 친화적인 오류 메시지를 제공합니다.
- **모듈 확장**: 새로운 도메인 기능은 `src/components/<domain>` 및 `src/pages`에 추가하고, 관련 타입은 `src/types`에 정의합니다.

## 린트 및 품질 관리

- `pnpm lint`: ESLint를 실행하여 코드 스타일과 잠재적인 오류를 점검합니다.
- TypeScript `strict` 모드가 활성화되어 있으므로, 컴파일 오류가 없도록 타입을 명시적으로 관리해야 합니다.

## 추가 자료

- [API 명세](./API_SPECIFICATION.md)
- [식단 데이터 샘플](./koreatech_meals_2025.json)
- [데이터베이스 스키마 예시](./create_meals_table.sql)

필요한 정보나 문서가 더 있다면 이 README에 자유롭게 추가해 주세요.
