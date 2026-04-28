# 에이전트 역할 정의 — 민예린 (프론트엔드)

## 프로젝트 개요

- **팀 프로젝트** — 총 6인 협업
- **프로젝트명**: 오늘의 냉장고 (냉장고 재료 기반 맞춤 레시피 추천 서비스)
- **저장소**: `team_project_humaneducation` (Spring Boot 서버 + Next.js 프론트엔드 + FastAPI 모델 서버)

---

## 민예린 담당 범위 (프론트엔드)

민예린은 **Next.js 프론트엔드**에서 자신이 담당하는 백엔드 3개 영역의 UI를 전담한다.

### 1. 회원 로직 UI
- 로그인 모달 (일반 로그인 / 카카오 로그인 탭)
- 회원가입 모달 (loginId / email / password / nickname 입력)
- 로그아웃 버튼 (일반 / 카카오 분기)
- 아이디 찾기 (이메일 입력 → loginId 반환)
- 인증 상태 전역 관리 (`AuthContext`, `sessionStorage` 기반)

**담당 파일**: `src/api/authApi.js`, `src/context/AuthContext.jsx`, `src/components/layout/public/LoginButton.jsx`, `src/components/layout/private/LogoutButton.jsx`

### 2. OCR 이미지 인식 UI
- 식재료 이미지 업로드 컴포넌트 (파일 선택 + 미리보기)
- 업로드 후 처리 상태 폴링 (PENDING → PROCESSING → COMPLETED/FAILED)
- 인식 결과 식재료 목록 표시 및 수정 UI

**담당 API 연동**:
- `POST /api/v1/fridge/ingredients/recognize-image`
- `GET /api/v1/fridge/ingredients/recognize-image/status/{requestId}`

### 3. 최저가 식재료 쇼핑 UI
- 부족 재료 기반 최저가 쇼핑 목록 표시
- 레시피별 부족 재료 쇼핑 연동 화면
- GraphRAG 기반 가성비 대체 식재료 추천 UI

**담당 API 연동**:
- `GET /api/v1/shopping/lowest-price`
- `GET /api/v1/shopping/recipes/{recipeId}/missing-items`
- `GET /api/v1/shopping/alternatives`

---

## Claude 작업 범위 및 제약

### Claude가 직접 실행하지 않는 것 (사용자가 직접 수행)
- **코드 실행** — `npm run dev`, `npm run build`, `npm test` 등 모든 실행 명령
- **Git 명령어** — `git commit`, `git pull`, `git push`, `git merge`, `git rebase`, `git checkout` 등 모든 Git 작업
- **빌드 검증** — 브라우저 동작 확인은 사용자가 직접 수행

### Claude가 수행하는 것
- 컴포넌트 및 훅 코드 작성, 수정, 버그 분석
- API 연동 코드 작성 (`src/api/`)
- 단위 테스트 코드 작성
- 파일 구조 설계 및 리뷰
- `.ai/` 문서 작성 및 업데이트

---

## 단위 테스트 원칙

**기능을 작성할 때마다 해당 기능의 단위 테스트를 함께 작성한다.**

| 레이어 | 테스트 대상 | 사용 도구 |
|--------|------------|---------|
| API 함수 | axios 요청/응답, 에러 처리 | Jest + axios-mock-adapter |
| Context | 상태 변화, sessionStorage 연동 | Jest + React Testing Library |
| Component | 렌더링, 사용자 인터랙션, 조건부 표시 | Jest + React Testing Library |

테스트 파일 위치: `src/__tests__/{도메인}/` 또는 컴포넌트와 동일 경로 `*.test.jsx`

---

## 프론트엔드 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS
- **HTTP 클라이언트**: Axios (`withCredentials: true`, HTTP-only 쿠키 기반 인증)
- **상태 관리**: React Context API (`AuthContext`)
- **인증 상태 복원**: `sessionStorage` (`authUser` 키 — `{ loginId, loginType }`)
- **테스트**: Jest + React Testing Library

---

## 팀원 연동 의존성

| 작업 | 의존하는 팀원 | 내용 |
|------|-------------|------|
| 로그인/회원가입 API | 백엔드 (민예린 본인) | Spring Boot auth/user API 완성 완료 |
| 식재료 목록 표시 | 식재료 담당 팀원 | `GET /api/v1/fridge/ingredients` 완성 필요 |
| 레시피 목록/상세 | 레시피 담당 팀원 | 레시피 API 완성 필요 |
| OCR 상태 폴링 | 백엔드 (민예린 본인) | `vision_recognition_request` API 완성 필요 |
| 쇼핑 연동 | 백엔드 (민예린 본인) | MCP 쇼핑 API 완성 필요 |

---

## 인증 구조 요약

```
sessionStorage["authUser"] = { loginId: string, loginType: "general" | "kakao" }
                  ↕ (복원/저장)
AuthContext.user  →  LoginButton / LogoutButton 조건부 렌더
HTTP-only Cookie  →  axios withCredentials:true 로 자동 전송 (Authorization 헤더 불필요)
```
