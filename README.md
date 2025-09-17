# K-Food 앱

한국기술교육대학교 식단 정보 시스템

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 5

## 프로젝트 구조

```
src/
├── components/         # 재사용 가능한 컴포넌트
│   ├── ui/            # 기본 UI 컴포넌트
│   ├── auth/          # 인증 관련 컴포넌트
│   ├── layout/        # 레이아웃 컴포넌트
│   └── meal/          # 식단 관련 컴포넌트
├── pages/             # 페이지 컴포넌트
│   ├── auth/          # 인증 페이지
│   └── [other pages]  # 기타 페이지
├── contexts/          # React Context
├── hooks/            # 커스텀 훅
├── lib/              # 유틸리티 및 API
└── App.tsx           # 메인 앱 컴포넌트
```

## 개발 환경 설정

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
`.env.example`을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정:
```bash
cp .env.example .env
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

앱이 `http://localhost:3000`에서 실행됩니다.

## 스크립트

- `pnpm dev` - 개발 서버 실행
- `pnpm build` - 프로덕션 빌드
- `pnpm start` - 프로덕션 미리보기
- `pnpm lint` - ESLint 실행

## API 구성

애플리케이션은 REST API와 통신합니다. 기본 API URL은 환경 변수로 설정할 수 있습니다:

- 개발환경: `http://localhost:8000/api`
- 프로덕션: 환경 변수로 설정

### API 엔드포인트

- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입  
- `POST /auth/logout` - 로그아웃
- `GET /auth/me` - 현재 사용자 정보
- `GET /meals?date=YYYY-MM-DD` - 특정 날짜 식단 조회
- `GET /nutrition?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - 영양정보 조회

## 주요 기능

- 🔐 **인증**: 한국기술교육대학교 이메일 기반 로그인/회원가입
- 🍱 **식단 조회**: 날짜별, 시간대별 식단 정보 확인
- 📊 **영양 분석**: 주간/월간 영양 섭취 현황 분석
- 👤 **사용자 관리**: 프로필 및 설정 관리
- 📱 **반응형 디자인**: 모바일 우선 디자인

## 브라우저 호환성

- Chrome (최신)
- Firefox (최신)  
- Safari (최신)
- Edge (최신)
