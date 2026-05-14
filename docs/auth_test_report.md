# 오늘냉장고 회원 인증 로직 단위 테스트 결과 보고서

**작성일자:** 2026-05-06
**테스트 대상:** 회원 인증 모듈 (Spring Boot 백엔드, Next.js 프론트엔드)
**테스트 환경:** 로컬 개발 환경 (Windows / JUnit 5 + Jest)

---

## 1. 개요

본 문서는 '오늘냉장고' 프로젝트의 핵심 보안 기능인 **JWT 기반 회원 인증 로직**에 대한 단위 테스트 시나리오와 실제 수행 결과를 기록한 산출물입니다.

- **서버 (Spring Boot):** Redis 기반 JWT 발급·검증·갱신·로그아웃 로직
- **프론트엔드 (Next.js):** 인증 API 호출, AuthContext 상태관리, 로그인/로그아웃 UI 컴포넌트

---

## 2. 테스트 항목 요약

### 2-1. 서버 단위 테스트

| TC ID | 테스트 파일 | 테스트 항목 | 상태 |
|---|---|---|---|
| TC-AUTH-S-01 | JwtProviderTest | createAccessToken: 비어있지 않은 JWT 문자열 반환 | **PASS** |
| TC-AUTH-S-02 | JwtProviderTest | createRefreshToken: 비어있지 않은 JWT 문자열 반환 | **PASS** |
| TC-AUTH-S-03 | JwtProviderTest | validateToken: 유효한 토큰은 true 반환 | **PASS** |
| TC-AUTH-S-04 | JwtProviderTest | validateToken: 만료된 토큰은 false 반환 | **PASS** |
| TC-AUTH-S-05 | JwtProviderTest | validateToken: 잘못된 형식의 토큰은 false 반환 | **PASS** |
| TC-AUTH-S-06 | JwtProviderTest | validateToken: 빈 문자열은 false 반환 | **PASS** |
| TC-AUTH-S-07 | JwtProviderTest | getLoginIdFromToken: loginId 정확히 추출 | **PASS** |
| TC-AUTH-S-08 | JwtProviderTest | createTokenCookie: HttpOnly·Secure·maxAge 속성 검증 | **PASS** |
| TC-AUTH-S-09 | JwtProviderTest | resolveTokenFromCookie: 지정 이름 쿠키에서 토큰 추출 | **PASS** |
| TC-AUTH-S-10 | JwtProviderTest | resolveTokenFromCookie: 쿠키 미존재 시 null 반환 | **PASS** |
| TC-AUTH-S-11 | AuthControllerTest | POST /auth/signup: 정상 회원가입 → success:true | **PASS** |
| TC-AUTH-S-12 | AuthControllerTest | POST /auth/signup: loginId 공백 → success:false | **PASS** |
| TC-AUTH-S-13 | AuthControllerTest | POST /auth/signup: 중복 loginId → DUPLICATE_LOGIN_ID | **PASS** |
| TC-AUTH-S-14 | AuthControllerTest | POST /auth/signup: 중복 email → DUPLICATE_EMAIL | **PASS** |
| TC-AUTH-S-15 | AuthControllerTest | GET /auth/check-login-id: 사용 가능한 아이디 → available:true | **PASS** |
| TC-AUTH-S-16 | AuthControllerTest | GET /auth/check-login-id: 중복 아이디 → available:false | **PASS** |
| TC-AUTH-S-17 | AuthControllerTest | POST /auth/login: 정상 로그인 → success:true + 쿠키 설정 | **PASS** |
| TC-AUTH-S-18 | AuthControllerTest | POST /auth/login: 이메일 미인증 → EMAIL_NOT_VERIFIED | **PASS** |
| TC-AUTH-S-19 | AuthControllerTest | POST /auth/login: 잘못된 비밀번호 → UNAUTHORIZED | **PASS** |
| TC-AUTH-S-20 | AuthControllerTest | POST /auth/logout: 정상 로그아웃 → success:true | **PASS** |
| TC-AUTH-S-21 | AuthControllerTest | POST /auth/refresh: 유효한 refreshToken → 새 토큰 쌍 발급 | **PASS** |
| TC-AUTH-S-22 | AuthControllerTest | POST /auth/refresh: 만료 refreshToken → REFRESH_TOKEN_EXPIRED | **PASS** |
| TC-AUTH-S-23 | AuthControllerTest | GET /auth/me: 미인증 요청 → UNAUTHORIZED | **PASS** |

**서버 합계: 23개 테스트 / 23개 PASS / 0개 FAIL**

---

### 2-2. 프론트엔드 단위 테스트

| TC ID | 테스트 파일 | 테스트 항목 | 상태 |
|---|---|---|---|
| TC-AUTH-F-01 | authApi.test.js | loginApi: POST /v1/auth/login 호출 | **PASS** |
| TC-AUTH-F-02 | authApi.test.js | loginApi: 서버 에러 시 reject | **PASS** |
| TC-AUTH-F-03 | authApi.test.js | logoutApi: POST /v1/auth/logout 호출 | **PASS** |
| TC-AUTH-F-04 | authApi.test.js | signupApi: POST /v1/auth/signup 호출 | **PASS** |
| TC-AUTH-F-05 | authApi.test.js | signupApi: 중복 아이디 시 reject | **PASS** |
| TC-AUTH-F-06 | authApi.test.js | checkLoginIdApi: GET /v1/auth/check-login-id 호출 | **PASS** |
| TC-AUTH-F-07 | authApi.test.js | checkLoginIdApi: 중복 아이디 → available:false 반환 | **PASS** |
| TC-AUTH-F-08 | authApi.test.js | getMeApi: GET /v1/auth/me 호출 (withCredentials) | **PASS** |
| TC-AUTH-F-09 | authApi.test.js | getMeApi: 미인증 시 reject | **PASS** |
| TC-AUTH-F-10 | authApi.test.js | findLoginIdApi: GET /v1/users/find-loginid 호출 | **PASS** |
| TC-AUTH-F-11 | authApi.test.js | findLoginIdApi: 미존재 이메일 시 reject | **PASS** |
| TC-AUTH-F-12 | AuthContext.test.jsx | 초기 user 상태는 null | **PASS** |
| TC-AUTH-F-13 | AuthContext.test.jsx | login() 호출 시 user 상태 설정 | **PASS** |
| TC-AUTH-F-14 | AuthContext.test.jsx | login() 호출 시 sessionStorage 저장 | **PASS** |
| TC-AUTH-F-15 | AuthContext.test.jsx | login() kakao 타입으로 저장 | **PASS** |
| TC-AUTH-F-16 | AuthContext.test.jsx | logout() 호출 시 user null 초기화 | **PASS** |
| TC-AUTH-F-17 | AuthContext.test.jsx | logout() 호출 시 sessionStorage 제거 | **PASS** |
| TC-AUTH-F-18 | AuthContext.test.jsx | 새로고침 시 sessionStorage에서 user 복원 | **PASS** |
| TC-AUTH-F-19 | AuthContext.test.jsx | 잘못된 JSON → null 상태로 시작 및 항목 제거 | **PASS** |
| TC-AUTH-F-20 | LoginButton.test.jsx | user=null이면 로그인 버튼 렌더링 | **PASS** |
| TC-AUTH-F-21 | LoginButton.test.jsx | user 있으면 LogoutButton 렌더링 | **PASS** |
| TC-AUTH-F-22 | LoginButton.test.jsx | 로그인 버튼 클릭 시 모달 오픈 | **PASS** |
| TC-AUTH-F-23 | LoginButton.test.jsx | 모달 닫기 버튼(×) 클릭 시 모달 닫힘 | **PASS** |
| TC-AUTH-F-24 | LoginButton.test.jsx | 아이디/비밀번호 미입력 시 에러 메시지 표시 | **PASS** |
| TC-AUTH-F-25 | LoginButton.test.jsx | 로그인 성공 시 login() 호출 및 모달 닫힘 | **PASS** |
| TC-AUTH-F-26 | LoginButton.test.jsx | 로그인 실패 시 에러 메시지 표시 | **PASS** |
| TC-AUTH-F-27 | LoginButton.test.jsx | 로그인 모달에 /signup 회원가입 링크 표시 | **PASS** |
| TC-AUTH-F-28 | LoginButton.test.jsx | 회원가입 링크 클릭 시 모달 닫힘 | **PASS** |
| TC-AUTH-F-29 | LogoutButton.test.jsx | user=null이면 아무것도 렌더링하지 않음 | **PASS** |
| TC-AUTH-F-30 | LogoutButton.test.jsx | general 타입 → nickname과 로그아웃 버튼 렌더링 | **PASS** |
| TC-AUTH-F-31 | LogoutButton.test.jsx | kakao 타입 → 카카오 로그아웃 버튼 렌더링 | **PASS** |
| TC-AUTH-F-32 | LogoutButton.test.jsx | 로그아웃 버튼 클릭 시 logoutApi 호출 | **PASS** |
| TC-AUTH-F-33 | LogoutButton.test.jsx | 로그아웃 버튼 클릭 시 logout() 호출 | **PASS** |
| TC-AUTH-F-34 | LogoutButton.test.jsx | 서버 오류 발생해도 logout() 호출 | **PASS** |
| TC-AUTH-F-35 | LogoutButton.test.jsx | 카카오 로그아웃 버튼 클릭 시 logout() 호출 | **PASS** |

**프론트엔드 합계: 35개 테스트 / 35개 PASS / 0개 FAIL**

---

## 3. 상세 테스트 케이스 및 수행 결과

### TC-AUTH-S-17 ~ S-19: 로그인 엔드포인트 (POST /auth/login)
- **테스트 목적:** 정상 로그인 시 JWT 쿠키가 발급되고, 이메일 미인증 / 잘못된 비밀번호 시 올바른 에러 코드를 반환하는지 확인
- **수행 방법:** WebMvcTest + MockBean으로 AuthService, JwtProvider를 모킹하여 각 시나리오 검증
- **실제 결과:**
  - 정상 로그인: HTTP 200, `success:true`, `message: "로그인되었습니다."` (**PASS**)
  - 이메일 미인증: `success:false`, `code: "EMAIL_NOT_VERIFIED"` (**PASS**)
  - 잘못된 비밀번호: `success:false`, `code: "UNAUTHORIZED"` (**PASS**)

### TC-AUTH-S-20: 로그아웃 엔드포인트 (POST /auth/logout)
- **테스트 목적:** 로그아웃 시 Access Token 블랙리스트 등록 및 Refresh Token 삭제 로직이 호출되는지 확인
- **수행 방법:** AuthService.invalidateSession() Mock 호출 검증
- **실제 결과:** HTTP 200, `success:true`, `message: "로그아웃되었습니다."` (**PASS**)

### TC-AUTH-S-21 ~ S-22: 토큰 갱신 엔드포인트 (POST /auth/refresh)
- **테스트 목적:** 유효한 Refresh Token으로 새 Access Token + Refresh Token 쌍을 발급하고, 만료된 Refresh Token 시 에러를 반환하는지 확인
- **수행 방법:** AuthService.refreshSession() Mock으로 정상/에러 케이스 분기 검증
- **실제 결과:**
  - 정상 갱신: HTTP 200, `success:true`, `message: "토큰이 재발급되었습니다."` (**PASS**)
  - 만료 토큰: `success:false`, `code: "REFRESH_TOKEN_EXPIRED"` (**PASS**)

### TC-AUTH-F-12 ~ F-19: AuthContext 상태 관리
- **테스트 목적:** 로그인/로그아웃/새로고침 시 user 상태와 sessionStorage가 올바르게 동기화되는지 확인
- **수행 방법:** Testing Library + jsdom 환경에서 AuthProvider 렌더링 후 버튼 클릭 이벤트 시뮬레이션
- **실제 결과:** 모든 8개 케이스 정상 동작 확인 (**PASS**)
- **특이사항:** `logout` 함수의 선언 순서 문제(TDZ 버그) 발견 및 `AuthContext.jsx` 수정 완료 — `const logout = useCallback(...)` 선언을 의존 `useEffect` 호출보다 앞으로 이동

### TC-AUTH-F-25 ~ F-26: 로그인 폼 동작 (LoginButton)
- **테스트 목적:** 로그인 성공 시 AuthContext.login() 호출 및 모달 닫힘, 실패 시 에러 메시지 노출 확인
- **수행 방법:** useAuth mock + loginApi mock으로 성공/실패 시나리오 분기
- **실제 결과:** 성공 시 `mockLogin` 호출 및 모달 닫힘, 실패 시 에러 메시지 노출 (**PASS**)

---

## 4. 테스트 과정에서 발견 및 조치된 문제

| 파일 | 발견 문제 | 조치 내용 |
|------|----------|---------|
| `JwtProviderTest.java` | `JwtProvider` 생성자 4번째 인자(`cookieSecure: boolean`) 누락 → 컴파일 오류 | `true` / `false` 인자 추가 |
| `AuthControllerTest.java` | `@MockBean` 4개(RedisEmailVerifyService, EmailService, KakaoOAuthService, UserRepository) 누락 → 컨텍스트 로드 실패 | 누락 `@MockBean` 추가 |
| `AuthControllerTest.java` | signup 성공 메시지 기대값 불일치 | 실제 메시지로 기대값 수정 |
| `UserControllerTest.java` | `ProfileResponse.createdAt` 타입 불일치 (`LocalDateTime` → `OffsetDateTime`) → 컴파일 오류 | 임포트 및 사용부 `OffsetDateTime`으로 교체 |
| `AuthContext.jsx` | `logout` 선언 전 `useEffect` 의존성 배열에서 참조 → **TDZ 런타임 에러** (프로덕션에도 영향) | `const logout = useCallback(...)` 선언을 관련 `useEffect` 앞으로 이동 |
| `LoginButton.test.jsx` | `next/navigation` 미mock → `invariant expected app router to be mounted` 오류 | `jest.mock('next/navigation', ...)` 추가 |
| `AuthContext.test.jsx` | `next/navigation` 미mock + `getMeApi` 미mock + async login() 처리 누락 | router mock, getMeApi mock 추가 및 `waitFor` 적용 |
| `authApi.test.js` | `getMeApi` 반환값 구조 불일치 (`res.data.data.loginId` → `res.loginId`) | 기대값 수정 (`unwrapApiData` 동작 반영) |
| `LogoutButton.test.jsx` | `user.loginId`가 아닌 `user.nickname`을 렌더링하는데 mock에 `nickname` 필드 누락 | mock에 `nickname: 'testuser1'` 추가 |
| `LoginButton.test.jsx` | 인라인 회원가입 폼 → `/signup` 링크로 변경됐는데 구식 폼 테스트 4개 잔존 | 링크 동작 검증 테스트 2개로 교체 |

---

## 5. 최종 실행 결과

```
[서버] ./gradlew test --tests "com.today.fridge.auth.*"
  ✅ JwtProviderTest          10 / 10 PASS
  ✅ AuthControllerTest       13 / 13 PASS
  총계: 23 / 23 PASS  BUILD SUCCESSFUL

[프론트엔드] npm test -- --watchAll=false
  ✅ authApi.test.js          11 / 11 PASS
  ✅ AuthContext.test.jsx      8 /  8 PASS
  ✅ LoginButton.test.jsx      9 /  9 PASS
  ✅ LogoutButton.test.jsx     7 /  7 PASS
  총계: 35 / 35 PASS
```

**전체 합계: 58개 테스트 / 58개 PASS / 0개 FAIL**
