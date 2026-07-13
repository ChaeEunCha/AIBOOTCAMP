# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

간단한 투두리스트 웹앱. 아직 코드가 작성되지 않은 초기 상태 프로젝트입니다.

## 기술 스택

- **React 19** (React Compiler 대상 포함) — Create React App은 공식 지원 종료(deprecated)되었으므로 사용하지 않는다.
- **TypeScript** strict 모드 — `tsconfig.json`에서 `strict: true` 필수.
- **빌드 도구**: Vite — CRA 대체 표준. `npm create vite@latest -- --template react-ts`로 생성.
- **패키지 매니저**: npm (프로젝트 규모상 별도 매니저 도입 불필요).
- **린트/포맷**: ESLint flat config(`eslint.config.js`) + `typescript-eslint`.
- **테스트**(필요 시): Vitest + React Testing Library.
- 프로젝트 규모가 작으므로 Redux/Zustand 같은 전역 상태 관리 라이브러리, Next.js 등 풀스택 프레임워크는 도입하지 않는다. `useState`/`useReducer` 등 React 내장 기능으로 충분하다.

## 코딩 컨벤션

- 함수형 컴포넌트 + 훅 사용. 클래스 컴포넌트 금지.
- Props, API 응답 등 외부 경계 데이터는 반드시 타입을 명시한다. `any` 사용 금지.
- 타입만 사용하는 import는 `import type`으로 분리한다.
- React 19 컴파일러가 자동 메모이제이션을 처리하므로 `useMemo`/`useCallback`/`React.memo`는 실측 성능 문제가 있을 때만 사용한다.

## 커밋 규칙

커밋 메시지는 한글로 작성한다.

예시: `feat: 할 일 완료 기능`

## 문제 해결 우선순위

작업 시 아래 순서를 우선순위로 삼는다.

1. 실제 동작하는 해결책 찾기
2. 기존 코드 패턴 분석 및 일관성 유지
3. 타입 안정성 보장하기
4. 재사용 가능한 구조로 설계
