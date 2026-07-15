# 프로젝트 파일 구조 설명

`create-next-app`으로 생성된 각 파일/폴더가 어떤 역할을 하는지 정리했습니다.

## 폴더 구조

```
next/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── PROJECT_STRUCTURE.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── next-env.d.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── node_modules/        # git 무시 대상
└── .next/               # git 무시 대상 (빌드 캐시)
```

## 설정 파일

| 파일 | 역할 |
|---|---|
| `package.json` | 프로젝트 메타 정보, 의존성 목록(`next`, `react`, `react-dom` 등), `dev`/`build`/`start`/`lint` 실행 스크립트 정의 |
| `package-lock.json` | 의존성의 정확한 버전을 고정해 다른 환경에서도 동일하게 설치되도록 보장 |
| `tsconfig.json` | TypeScript 컴파일 옵션. `@/*` → `./src/*` 경로 별칭(alias) 설정 포함 |
| `next.config.ts` | Next.js 자체 설정 파일 (이미지 도메인, 리다이렉트, 실험적 기능 등을 여기에 추가) |
| `eslint.config.mjs` | ESLint 규칙 설정. Next.js 권장 규칙(`core-web-vitals`, `typescript`)을 불러와 적용 |
| `postcss.config.mjs` | PostCSS 설정. Tailwind CSS v4 플러그인(`@tailwindcss/postcss`)을 등록해 CSS 빌드에 사용 |
| `next-env.d.ts` | Next.js가 자동 생성하는 타입 참조 파일. **직접 수정하지 않음** |

## AI 에이전트 지시 파일

| 파일 | 역할 |
|---|---|
| `AGENTS.md` | Next.js 16이 이전 버전과 구조/API가 다르니, AI 코딩 도구가 옛날 지식으로 코드를 짜지 말고 `node_modules/next/dist/docs/`의 최신 문서를 먼저 확인하라고 안내하는 파일. `create-next-app`이 최신 버전부터 기본 생성함 |
| `CLAUDE.md` | `@AGENTS.md`를 그대로 참조(import)만 하는 파일. Claude Code가 `AGENTS.md`의 내용을 읽도록 연결하는 역할 |

## 소스 코드 (`src/app` — App Router)

| 파일 | 역할 |
|---|---|
| `src/app/layout.tsx` | 모든 페이지를 감싸는 최상위 레이아웃. `<html>`, `<body>` 태그, 폰트(Geist Sans/Mono), 전역 `metadata`(title, description) 정의 |
| `src/app/page.tsx` | 루트 경로(`/`)에 대응하는 페이지 컴포넌트. `create-next-app`이 기본 제공하는 데모 화면 |
| `src/app/globals.css` | 전역 스타일시트. Tailwind CSS import, 라이트/다크 모드 색상 변수 정의 |
| `src/app/favicon.ico` | 브라우저 탭에 표시되는 파비콘 |

> App Router 규칙: `src/app` 안의 폴더 경로가 곧 URL 경로가 되고, 폴더 안 `page.tsx`가 해당 경로의 화면이 됩니다. (예: `src/app/about/page.tsx` → `/about`)

## 정적 파일 (`public`)

| 파일 | 역할 |
|---|---|
| `public/*.svg` | 데모 페이지에서 쓰이는 로고 이미지들 (`next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`). `public` 폴더 안 파일은 `/파일명`으로 바로 접근 가능 |

## 기타

| 파일 | 역할 |
|---|---|
| `README.md` | `create-next-app`이 기본 생성하는 안내 문서 (개발 서버 실행법 등) |
| `.next/` (git 무시 대상) | `next dev`/`next build` 실행 시 생성되는 빌드 결과물 캐시 폴더. 직접 건드릴 필요 없음 |
