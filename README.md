# Clippy FE

지상 최고의 클립 생성 서비스 Clippy의 Frontend 레포지토리입니다.

## Tech Stacks

- Next.js
- Recoil
- Mantine UI
- Tailwind CSS

---

# Clippy - 트위치 클립 생성 및 공유 서비스

![Clippy Logo](/public/logo.png)

Clippy는 트위치의 클리핑 기능을 대체하는 서드파티 서비스로, 트위치 스트림 영상을 쉽게 클립으로 만들고 공유할 수 있는 플랫폼입니다.

## 시연 영상

[![Clippy 시연 영상](https://img.youtube.com/vi/cO-SeiiMc68/0.jpg)](https://www.youtube.com/watch?v=cO-SeiiMc68)

## 주요 기능

### 클립 생성

- 트위치 라이브 스트림 영상을 손쉽게 클립으로 제작
- 팔로우한 스트리머 및 인기 스트리머의 라이브 스트림 접근
- 클립 제목 및 설명 추가 기능

### 클립 공유

- 생성한 클립을 다른 사용자와 공유
- 소셜 미디어 공유 기능
- 임베드 코드 제공으로 외부 사이트에 삽입 가능

### 클립 관리

- 마이페이지에서 생성한 클립 관리
- 클립 편집 및 삭제 기능
- 클립 통계 확인

### 클립 탐색

- 인기 클립 탐색
- 스트리머별 클립 모아보기
- 검색 기능을 통한 클립 찾기

## 기술 스택

### 프론트엔드

- [Next.js](https://nextjs.org/) - React 기반 프레임워크
- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 지원
- [Recoil](https://recoiljs.org/) - 상태 관리 라이브러리
- [Mantine UI](https://mantine.dev/) - UI 컴포넌트 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크

### 미디어 처리

- [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream/) - 비디오 스트리밍
- [VidStack](https://www.vidstack.io/) - 비디오 플레이어 라이브러리

### 개발 도구

- [Axios](https://axios-http.com/) - HTTP 클라이언트
- [Sentry](https://sentry.io/) - 에러 모니터링
- [FontAwesome](https://fontawesome.com/) - 아이콘 라이브러리

## 프로젝트 구조

```
clippy-fe/
├── components/         # 재사용 가능한 컴포넌트
│   ├── aside/          # 사이드바 컴포넌트
│   ├── channel/        # 채널 관련 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── create/         # 클립 생성 관련 컴포넌트
│   ├── index/          # 메인 페이지 컴포넌트
│   ├── mypage_create/  # 마이페이지 클립 생성 컴포넌트
│   ├── mypage_manage/  # 마이페이지 클립 관리 컴포넌트
│   ├── view/           # 클립 보기 관련 컴포넌트
│   ├── constValues.tsx # 상수 값 정의
│   └── states.tsx      # Recoil 상태 정의
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 함수
├── pages/              # 페이지 컴포넌트
│   ├── api/            # API 라우트
│   ├── channel/        # 채널 페이지
│   ├── clip/           # 클립 관련 페이지
│   ├── mypage/         # 마이페이지
│   ├── search/         # 검색 페이지
│   ├── _app.tsx        # Next.js 앱 컴포넌트
│   └── index.tsx       # 메인 페이지
├── public/             # 정적 파일
├── styles/             # 스타일 파일
├── util/               # 유틸리티 함수
├── next.config.js      # Next.js 설정
└── tailwind.config.js  # Tailwind CSS 설정
```

## 주요 페이지 설명

### 메인 페이지 (`/`)

- 인기 클립 목록 표시
- 라이브 중인 스트리머 목록

### 클립 페이지 (`/clip/[clipId]`)

- 클립 재생 및 정보 표시
- 댓글 기능
- 클립 공유 기능

### 채널 페이지 (`/channel/[channelId]`)

- 특정 스트리머의 클립 목록
- 스트리머 정보

### 마이페이지 (`/mypage`)

- 사용자가 생성한 클립 관리
- 클립 생성 기능
- 계정 설정

### 검색 페이지 (`/search`)

- 클립 및 스트리머 검색 기능

## 시작하기

### 개발 환경 설정

1. 저장소 클론

```bash
git clone [repository-url]
cd clippy-fe
```

2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

4. 브라우저에서 확인

- [http://localhost:3000](http://localhost:3000)

## 빌드 및 배포

프로덕션 빌드를 생성하려면:

```bash
npm run build
# 또는
yarn build
```

서버를 시작하려면:

```bash
npm run start
# 또는
yarn start
```

## 기여하기

1. 이 저장소를 포크합니다.
2. 새 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 [라이선스 이름] 라이선스 하에 배포됩니다.

---

# Clippy - Twitch Clip Creation and Sharing Service

![Clippy Logo](/public/logo.png)

Clippy is a third-party service that replaces Twitch's clipping functionality, allowing users to easily create and share clips from Twitch stream videos.

## Demonstration Video

[![Clippy Demo Video](https://img.youtube.com/vi/cO-SeiiMc68/0.jpg)](https://www.youtube.com/watch?v=cO-SeiiMc68)

## Key Features

### Clip Creation

- Easily create clips from Twitch live streams
- Access to followed streamers and popular streamers' live streams
- Add titles and descriptions to clips

### Clip Sharing

- Share created clips with other users
- Social media sharing functionality
- Embed code provision for insertion into external sites

### Clip Management

- Manage created clips in My Page
- Edit and delete clip functionality
- View clip statistics

### Clip Exploration

- Browse popular clips
- View clips by streamer
- Find clips through search functionality

## Technology Stack

### Frontend

- [Next.js](https://nextjs.org/) - React-based framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing support
- [Recoil](https://recoiljs.org/) - State management library
- [Mantine UI](https://mantine.dev/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### Media Processing

- [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream/) - Video streaming
- [VidStack](https://www.vidstack.io/) - Video player library

### Development Tools

- [Axios](https://axios-http.com/) - HTTP client
- [Sentry](https://sentry.io/) - Error monitoring
- [FontAwesome](https://fontawesome.com/) - Icon library

## Project Structure

```
clippy-fe/
├── components/         # Reusable components
│   ├── aside/          # Sidebar components
│   ├── channel/        # Channel-related components
│   ├── common/         # Common components
│   ├── create/         # Clip creation components
│   ├── index/          # Main page components
│   ├── mypage_create/  # My Page clip creation components
│   ├── mypage_manage/  # My Page clip management components
│   ├── view/           # Clip viewing components
│   ├── constValues.tsx # Constant definitions
│   └── states.tsx      # Recoil state definitions
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── api/            # API routes
│   ├── channel/        # Channel pages
│   ├── clip/           # Clip-related pages
│   ├── mypage/         # My Page
│   ├── search/         # Search page
│   ├── _app.tsx        # Next.js app component
│   └── index.tsx       # Main page
├── public/             # Static files
├── styles/             # Style files
├── util/               # Utility functions
├── next.config.js      # Next.js configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Main Pages Description

### Main Page (`/`)

- Display popular clips
- List of live streamers

### Clip Page (`/clip/[clipId]`)

- Clip playback and information display
- Comment functionality
- Clip sharing functionality

### Channel Page (`/channel/[channelId]`)

- List of clips for a specific streamer
- Streamer information

### My Page (`/mypage`)

- Management of user-created clips
- Clip creation functionality
- Account settings

### Search Page (`/search`)

- Clip and streamer search functionality

## Getting Started

### Development Environment Setup

1. Clone the repository

```bash
git clone [repository-url]
cd clippy-fe
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run development server

```bash
npm run dev
# or
yarn dev
```

4. View in browser

- [http://localhost:3000](http://localhost:3000)

## Build and Deploy

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the server:

```bash
npm run start
# or
yarn start
```

## Contributing

1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Create a Pull Request.

## License

This project is distributed under the [License Name] license.
