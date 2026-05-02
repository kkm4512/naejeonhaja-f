# 내전하자 프론트엔드

Nuxt 3 기반 프론트엔드 프로젝트입니다. Riot 소환사 조회를 통해 10인 팀 빌드 요청을 백엔드에 전송하고, 최종 팀 밸런스 결과를 보여줍니다.

## 주요 기능

- Riot 소환사 이름으로 프로필 조회
- 소환사 티어, 레벨, 프로필 아이콘, 리그 정보 표시
- 1~2개 라인 선택 가능한 팀 멤버 추가
- 10인 팀을 구성하여 백엔드로 팀 밸런스 요청
- JSON 모드로 직접 팀 요청 페이로드 입력 가능

## 구조

- `app.vue`: 전체 레이아웃과 공통 설정
- `pages/index.vue`: 메인 페이지 진입점
- `components/TeamBuilder.vue`: 팀 빌드 UI 및 팀 요청 로직
- `components/TeamResultDisplay.vue`: 팀 결과 카드 렌더링
- `services/apiClient.ts`: 백엔드 API 호출 래퍼
- `types/api.ts`: API 요청/응답 타입 정의
- `assets/css/main.css`: 전역 스타일

## 설치

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev
```

## 빌드

```bash
npm run build
```

## 미리보기

```bash
npm run preview
```

## 설정

`nuxt.config.ts`에서 `runtimeConfig.public.baseApiUrl`을 수정하여 백엔드 API 엔드포인트를 변경할 수 있습니다.

기본값:

```ts
baseApiUrl: 'https://naejeonhaja-b.onrender.com'
```

## 주의

- 프로젝트는 `Nuxt 4.4.4` 및 TypeScript `5.6.0` 기반입니다.
- 백엔드 서버가 정상 동작 중이어야 Riot 소환사 조회와 팀 요청이 가능합니다.
