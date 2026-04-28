# Research — 민예린 담당 프론트엔드 구현 참고

---

## 1. 현재 프로젝트 구조 요약

### 기술 스택 (실제 코드 기준)
- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4, CSS Variables (`globals.css`)
- **HTTP 클라이언트**: Axios — `src/config/axios.js` (baseURL: `/api`, `withCredentials: true`)
- **인증**: HTTP-only 쿠키 (Spring Boot 발급), `sessionStorage` 기반 클라이언트 상태 복원
- **상태 관리**: React Context API

### 도메인 파일 구성

```
src/
├── api/
│   └── authApi.js           (로그인/로그아웃/회원가입/아이디찾기 API 함수)
├── config/
│   └── axios.js             (Axios 인스턴스, 인터셉터)
├── context/
│   └── AuthContext.jsx      (AuthProvider, useAuth 훅)
├── app/
│   ├── layout.js            (RootLayout — AuthProvider 래핑)
│   └── page.js              (랜딩 페이지)
├── components/
│   ├── layout/
│   │   ├── public/
│   │   │   ├── Header.jsx       (상단 헤더 — 로그인 버튼 포함)
│   │   │   └── LoginButton.jsx  (로그인/회원가입 모달)
│   │   └── private/
│   │       └── LogoutButton.jsx (로그아웃 버튼 — 일반/카카오 분기)
│   └── ui/
│       ├── Button.jsx
│       └── Modal.jsx
└── ...
```

---

## 2. 팀 공식 스펙 반영 현황 (2026-04-28 확인)

### 2-0. 현행 authApi.js vs 팀 공식 API 스펙 대조

| 구분 | 팀 공식 경로 | 현행 authApi.js 경로 | 상태 |
|------|------------|------------------|------|
| 로그인 | `POST /api/v1/auth/login` | `POST /v1/auth/login` | ⚠️ baseURL `/api` 포함 시 정상 — 확인 필요 |
| 로그아웃 | `POST /api/v1/auth/logout` | `POST /v1/auth/logout` | ⚠️ 동일 |
| 회원가입 | `POST /api/v1/auth/signup` | `POST /v1/users/signup` | ⚠️ 경로 불일치 — 서버 변경 완료 후 수정 필요 |
| CSRF 토큰 발급 | `GET /api/v1/auth/csrf-token` | 미구현 | ❌ |
| 아이디 중복 확인 | `GET /api/v1/auth/check-login-id` | 미구현 | ❌ |
| Refresh Token 재발급 | `POST /api/v1/auth/refresh` | 미구현 | ❌ |
| 현재 사용자 조회 | `GET /api/v1/auth/me` | 미구현 | ❌ |
| 아이디 찾기 | (팀 스펙 미포함) | `GET /v1/users/find-loginid` | ℹ️ 팀 재확인 필요 |

> **참고**: Axios baseURL이 `/api`이므로 authApi.js의 `/v1/auth/login` 호출 시 실제 경로는 `/api/v1/auth/login`. 서버 경로와 일치.

### 2-0-1. 인증·보안 정책 팀 확정 사항 (프론트엔드 영향)

| 정책 | 내용 | 현행 구현 상태 |
|------|------|--------------|
| 토큰 저장 | JWT 원문은 HttpOnly Cookie만 허용, localStorage/sessionStorage 저장 금지 | ✅ withCredentials:true, 토큰 직접 접근 없음 |
| 전역 상태 | loginId + loginType 요약 정보만 저장 | ✅ sessionStorage["authUser"] 정책 준수 |
| CSRF | 상태 변경 요청(POST/PATCH/DELETE)에 `X-CSRF-Token` 헤더 필수 | ❌ 미구현 — axios 인터셉터 추가 필요 |
| SameSite | Lax 기본, HTTPS 배포 시 Secure | 서버 쿠키 설정 — 프론트 직접 제어 불필요 |

### 2-0-2. CSRF 구현 계획 (서버 구현 완료 후 진행)

```
1. 앱 초기 로드 시 GET /api/v1/auth/csrf-token 호출 → 토큰 쿠키 수신
2. axios.js 요청 인터셉터: POST/PATCH/DELETE 요청 시 X-CSRF-Token 헤더 자동 추가
3. src/api/authApi.js에 csrfTokenApi() 함수 추가
4. AuthContext 또는 layout.js 초기화 시 호출
```

### 2-0-3. /auth/me 기반 사용자 복원 계획

- **현재**: 로그인 폼 입력값 → sessionStorage → AuthContext 마운트 시 복원 (새로고침 대응)
- **개선 방향**: `GET /api/v1/auth/me` 서버 구현 완료 후 마운트 시 API 호출로 교체 → 더 신뢰도 높은 인증 상태 복원 가능

---

## 3. 작업 이력

---

### [2026-04-28] 회원 로직 프론트엔드 구현

#### 3-1. 버그 수정: axios.js — 미정의 `getAccessToken()` 호출 제거

**문제**: `src/config/axios.js` 요청 인터셉터에서 `getAccessToken()`을 호출하고 있었으나 해당 함수가 어디에도 정의되어 있지 않아 모든 API 요청 시 `ReferenceError` 발생.

**수정 내용**:
- `Authorization: Bearer ${getAccessToken()}` 헤더 블록 전체 제거
- Spring Boot 서버가 HTTP-only 쿠키로 인증하므로 `withCredentials: true` 설정만으로 충분

**파일**: `src/config/axios.js`

---

#### 3-2. 신규 구현: 인증 API 함수

**파일**: `src/api/authApi.js`

| 함수 | HTTP | 경로 | 설명 |
|------|------|------|------|
| `loginApi(loginId, password)` | POST | `/v1/auth/login` | 일반 로그인 |
| `logoutApi()` | POST | `/v1/auth/logout` | 로그아웃 |
| `signupApi({ loginId, email, password, nickname })` | POST | `/v1/users/signup` | 회원가입 (서버 경로 변경 시 수정 예정) |
| `findLoginIdApi(email)` | GET | `/v1/users/find-loginid?email=` | 이메일로 아이디 찾기 |

---

#### 3-3. 신규 구현: AuthContext — 전역 인증 상태 관리

**파일**: `src/context/AuthContext.jsx`

| 항목 | 내용 |
|------|------|
| `user` 상태 | `{ loginId: string, loginType: "general" \| "kakao" } \| null` |
| `login(loginId, loginType)` | sessionStorage 저장 + state 업데이트 |
| `logout()` | sessionStorage 제거 + state null 처리 |
| `useEffect` | 마운트 시 `sessionStorage["authUser"]` 복원 (새로고침 대응) |
| `useAuth()` | 하위 컴포넌트에서 `user`, `login`, `logout` 접근 |

**sessionStorage 키**: `authUser` — JSON 직렬화된 `{ loginId, loginType }`

**설계 이유**: 서버가 로그인 응답 body에 사용자 정보를 반환하지 않고 HTTP-only 쿠키만 발급하므로, 클라이언트는 로그인 폼 입력값에서 `loginId`를 직접 추출하여 저장.

---

#### 3-4. 신규 구현 / 수정: LoginButton.jsx — 로그인/회원가입 모달

**파일**: `src/components/layout/public/LoginButton.jsx`

**동작 분기**:
- `user` 존재 시 (로그인 상태): `<LogoutButton />` 렌더
- `user` 없을 시 (비로그인): "로그인" 버튼 → 모달 오픈

**모달 탭 구조**:

| 탭 | 입력 필드 | 동작 |
|----|-----------|------|
| 로그인 | loginId, password (Enter 키 지원) | `loginApi` 호출 → `login(loginId, "general")` → 모달 닫기 |
| 회원가입 | loginId, email, password, nickname | `signupApi` 호출 → 성공 시 로그인 탭으로 전환 |

- 카카오 로그인 버튼: UI 배치 완료, 실제 연동은 팀 계정 발급 후 구현 예정
- 에러 메시지: 각 탭 내 인라인 표시

---

#### 3-5. 신규 구현: LogoutButton.jsx — 로그아웃 버튼

**파일**: `src/components/layout/private/LogoutButton.jsx`

| 조건 | 렌더 |
|------|------|
| `loginType === "kakao"` | "카카오 로그아웃" 버튼 |
| `loginType === "general"` | `{loginId}` 텍스트 + "로그아웃" 버튼 |
| `user === null` | null (렌더 없음) |

- `logoutApi()` 호출 후 성공/실패 무관하게 `logout()` 실행 (finally 블록)

---

#### 3-6. 수정: Header.jsx — LoginButton 통합

**파일**: `src/components/layout/public/Header.jsx`

- 기존 "시작하기" 버튼 옆에 `<LoginButton />` 추가
- `<div className="flex items-center gap-3">` 래퍼로 정렬

---

#### 3-7. 수정: layout.js — AuthProvider 래핑

**파일**: `src/app/layout.js`

- `<AuthProvider>` 로 `{children}` 래핑하여 전체 앱에서 `useAuth()` 사용 가능하도록 설정

---

#### 3-8. 단위 테스트 작성 완료 [2026-04-28]

**신규 파일**: `jest.config.js`, `jest.setup.js`
**신규 devDependencies**: `jest@^29`, `jest-environment-jsdom@^29`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`, `@testing-library/user-event@^14`
**npm 스크립트 추가**: `test`, `test:watch`, `test:coverage`

| 파일 | 테스트 수 |
|------|---------|
| `src/__tests__/api/authApi.test.js` | 6개 |
| `src/__tests__/context/AuthContext.test.jsx` | 8개 |
| `src/__tests__/components/LogoutButton.test.jsx` | 7개 |
| `src/__tests__/components/LoginButton.test.jsx` | 10개 |

**모킹 전략**

| 테스트 대상 | 모킹 대상 |
|-----------|---------|
| `authApi.test.js` | `@/config/axios` (axios 인스턴스만 모킹) |
| `AuthContext.test.jsx` | 없음 (실제 Context + sessionStorage 사용) |
| `LogoutButton.test.jsx` | `useAuth`, `logoutApi` |
| `LoginButton.test.jsx` | `useAuth`, `loginApi`, `signupApi`, `LogoutButton` |

---

## 4. 인프라 참고사항

### 4-1. Axios 인스턴스 설정

`src/config/axios.js`:
- `baseURL`: `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"`
- `withCredentials: true` — HTTP-only 쿠키 자동 전송
- 응답 인터셉터: 에러를 `{ name, message, status, data, code, url, method, originalError }` 형태로 정규화

### 4-2. 카카오 로그인 (LoginButton) — 미구현

- 팀 내 카카오 개발자 계정 생성 필요
- RestApiKey 환경변수 설정 필요
- 현재 UI 버튼만 존재, 클릭 핸들러 미연결

### 4-3. ApiResponse 공통 응답 형식 (서버 기준)

```json
{
  "success": true,
  "code": "200",
  "message": "...",
  "requestId": "req_xxx",
  "data": { ... }
}
```

`authApi.js`에서 `response.data.data`로 실제 데이터 접근.
