# 서울랜드 (Seoul Land) — 메인페이지 클론

`mainpage.png` 시안과 `images/` 폴더의 에셋을 참고해 만든 Next.js(App Router) 랜딩 페이지입니다.

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 폴더 구조

```
src/
  app/
    layout.tsx        # 루트 레이아웃, 폰트(Noto Sans KR) 설정
    page.tsx           # 홈 페이지 - 섹션 컴포넌트 조립
    globals.css         # Tailwind v4 테마 토큰 (서울랜드 컬러 팔레트)
  components/
    layout/            # Header, SideNav(우측 고정 내비게이션), Footer
    sections/           # 히어로, 동행 선택, 혜택, 웰컴, 어트랙션, 공연, 강 디바이더, SNS, 공지
    ui/                 # SectionHeading, QuickLinkIcon, SocialIcon 등 재사용 UI
  data/                 # 각 섹션에 들어가는 콘텐츠(배너, 혜택, 어트랙션, 공연, SNS, 공지)를 분리한 타입/데이터
public/
  images/               # 원본 이미지 에셋 (원본 images/ 폴더를 그대로 이동)
    sections/           # 컴포넌트 전용으로 가공한 배경 이미지
```

콘텐츠(문구, 이미지 경로, 링크 등)는 전부 `src/data/*.ts`에 있어서, 실제 운영 데이터로 교체할 때 컴포넌트를 건드릴 필요 없이 데이터 파일만 수정하면 됩니다.

## 사용 기술

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- lucide-react (아이콘)
