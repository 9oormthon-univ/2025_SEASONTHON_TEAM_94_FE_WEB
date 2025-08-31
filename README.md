# StopUsingIt Web

## 🚀 빠른 시작

### 개발 환경 실행
```bash
pnpm run dev
```

### 빌드
```bash
pnpm run build
```

---

## 📋 개발 가이드라인

### 1. 코딩 스타일 및 컨벤션

- **린터 & 포맷터:**
  - `ESLint` + `Prettier` 사용
  - **설정:**
    - ESLint: React 기본 설정 사용 + 필요한 규칙 추가
    - Prettier: Prettier 기본 설정 사용
  - **강제:** Git `pre-commit` hook 설정 (`husky` + `lint-staged`)하여 커밋 전 자동 검사/수정
- **네이밍 컨벤션:**
  - **파일/폴더:** `kebab-case` (예: `user-profile.tsx`, `utils/`)
  - **컴포넌트:** `PascalCase` (예: `UserProfileCard`)
  - **변수/함수:** `camelCase` (예: `getUserData`, `isLoading`)
  - **상수:** `UPPER_SNAKE_CASE` (예: `MAX_RETRIES`)
  - **타입/인터페이스 (TS):** `PascalCase` (예: `UserData`, `IProduct`)
- **주석:**
  - **필수:** 복잡한 로직, 임시 해결책 (`// TODO:`, `// FIXME:`), 다른 개발자가 이해하기 어려운 부분
  - **지양:** 너무 당연하거나 코드를 그대로 설명하는 주석

---

### 2. 기술 스택 및 라이브러리

- **프레임워크:** `React Router v7` (Full-stack React framework)
- **스타일링:** `Tailwind CSS v4`
- **UI 컴포넌트:** `Radix UI` + `shadcn/ui`
- **애니메이션:** `Motion (Framer Motion)`
- **폼 관리:** `React Hook Form` + `Zod` (validation)
- **상태 관리:** React의 내장 상태 관리 사용 (Context API, useState 등)
- **날짜 처리:** `date-fns`
- **유틸리티:** `clsx`, `tailwind-merge` (클래스명 조합)
- **알림:** `Sonner` (토스트 알림)
- **테마:** `next-themes` (다크/라이트 모드)

---

### 3. 프로젝트 구조 (React Router v7 기반)

React Router v7의 파일 기반 라우팅을 사용하며, **Feature-Based** 구조로 구성되어 있습니다.

```
├── app/                          # React Router v7 앱 디렉토리
│   ├── root.tsx                  # 루트 컴포넌트 (HTML 구조, 전역 설정)
│   ├── routes.ts                 # 라우트 설정
│   ├── app.css                   # 전역 스타일 (Tailwind CSS)
│   ├── assets/                   # 이미지, 아이콘 등 정적 자산
│   ├── routes/                   # 페이지 라우트
│   │   ├── _index.tsx            # 홈페이지 (/)
│   │   ├── expenses._index.tsx   # 지출 목록 (/expenses)
│   │   ├── expenses.$expenseId.tsx # 지출 상세 (/expenses/:expenseId)
│   │   ├── expenses.add.tsx      # 지출 추가 (/expenses/add)
│   │   └── report.tsx            # 리포트 (/report)
│   ├── features/                 # 기능별 모듈
│   │   ├── expenses/             # 지출 관리 기능
│   │   │   ├── index.ts          # 외부 노출 인터페이스
│   │   │   ├── api/              # API 관련
│   │   │   ├── components/       # 기능 전용 컴포넌트
│   │   │   ├── hooks/            # 기능 전용 훅
│   │   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── utils/            # 유틸리티 함수
│   │   │   └── _lib/types/       # 타입 정의
│   │   ├── reports/              # 리포트 기능
│   │   ├── profile/              # 프로필 기능
│   │   └── more/                 # 기타 기능
│   ├── shared/                   # 공통 모듈
│   │   ├── components/ui/        # 재사용 가능한 UI 컴포넌트
│   │   ├── config/               # 설정 파일
│   │   ├── hooks/                # 공통 커스텀 훅
│   │   ├── types/                # 공통 타입 정의
│   │   └── utils/                # 공통 유틸리티
│   └── types/                    # 전역 타입 정의
├── public/                       # 정적 파일
├── components.json               # shadcn/ui 설정
├── react-router.config.ts        # React Router 설정
├── vite.config.ts                # Vite 설정
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.js            # Tailwind CSS 설정
└── package.json
```

**핵심 원칙:**
- **파일 기반 라우팅:** `app/routes/` 폴더의 파일명이 URL 경로가 됨
- **기능별 분리:** 각 기능(`features/`)은 독립적인 모듈로 구성
- **컴포넌트 분리:** 재사용 가능한 UI 컴포넌트(`shared/components/ui/`)와 기능별 컴포넌트 분리
- **타입 안전성:** TypeScript를 통한 강타입 시스템 활용

---

### 4. Git 및 협업 워크플로우

- **브랜치 전략:** `GitHub Flow`

  - `main` 브랜치는 항상 배포 가능한 상태 유지.
  - 모든 작업(기능, 버그 수정)은 `feature/` 또는 `fix/` 등 브랜치에서 진행 (`main`에서 분기).
  - 작업 완료 후 `main`으로 Pull Request(PR) 생성.

- **커밋 메시지:** `Conventional Commits` 사용 권장
  - 형식: `<type>(<scope>): <subject>` (예: `feat(expenses): add expense form validation`)

- **Pull Request (PR):**
  - **템플릿:** 간단하게라도 사용 (변경 내용 요약, 관련 이슈 번호)
  - **리뷰:** 최소 1명 이상 리뷰 권장 (코드 품질 향상, 지식 공유)
  - **CI:** 자동화된 검사(린트, 테스트, 빌드) 통과 필수
  - **병합:** `Squash and merge` (커밋 히스토리 깔끔하게 유지)
    1. **Squash (스쿼시):** 병합하려는 브랜치(예: feature/my-new-feature)의 **모든 커밋들을 하나로 합칩니다.** 여러 개의 작은 커밋("fix typo", "WIP", "refactor part 1", "add UI")이 하나의 새로운 커밋으로 묶이는 것
    2. **Merge (머지):** 하나로 합쳐진 **단일 커밋을 대상 브랜치(예: main)에 병합**

---

### 5. API 연동 및 데이터 관리

- **API 호출:** `app/features/[feature]/api/` 폴더에 API 호출 함수 분리
- **데이터 페칭:** React Router의 `loader` 함수 활용하여 페이지 로드 시 데이터 사전 로드
- **상태 관리:** 
  - 로컬 상태: React의 `useState`, `useReducer` 사용
  - 전역 상태: Context API 활용 (필요시)
  - 서버 상태: React Router의 `loader`와 `action` 함수 활용
- **폼 관리:** `React Hook Form` + `Zod`를 통한 타입 안전한 폼 검증
- **타입 정의:** API 응답 타입은 `app/shared/types/` 또는 관련 피처 폴더 내 `_lib/types/`에 정의
- **환경 변수:** `VITE_` 접두사 사용하여 클라이언트 환경 변수 노출

---

### 6. React Router 라우팅 처리

- **파일 기반 라우팅:** 파일명이 URL 경로를 결정
  - `_index.tsx` → `/` (인덱스 라우트)
  - `expenses._index.tsx` → `/expenses`
  - `expenses.$expenseId.tsx` → `/expenses/:expenseId`
  - `expenses.add.tsx` → `/expenses/add`

- **Data Loading:** `loader` 함수를 통한 서버사이드 데이터 로딩
- **Form Actions:** `action` 함수를 통한 폼 제출 처리
- **Error Boundaries:** 라우트별 에러 처리
- **SSR/SPA 모드:** `react-router.config.ts`에서 설정 가능

---

### 7. 문서화

- **필수:** `README.md` (프로젝트 설정, 실행 방법, 주요 결정 사항 요약)
- **권장:** 복잡한 컴포넌트나 함수에는 JSDoc 스타일 주석 사용

---

### 9. 유용한 리소스

- [Toss Slash(TypeScript/JavaScript 패키지)](https://www.slash.page/ko/)
- [React-Use(범용 커스텀 훅)](https://github.com/streamich/react-use?tab=readme-ov-file)

