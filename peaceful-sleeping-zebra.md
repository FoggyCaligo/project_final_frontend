# 식재료 최저가 비교 페이지 구현 계획
### [메모] 여기에서 중요한 점은 팀프로젝트라서 내가 만들어야 하는 기은 외에 다른 페이지는 수정하면 안된다. 
## Context
"오늘의 냉장고" 프로젝트에 식재료별 최저가 비교 페이지를 추가한다.
네이버 쇼핑 / 쿠팡 두 플랫폼의 가격을 비교해 보여주며, 우선은 샘플 JSON 목(mock) 데이터로
UI를 완성하고 실제 API 연동 구조도 함께 준비한다.

---

## 구현 범위

### 1. 샘플 목 데이터 파일
**파일:** `src/data/mockShoppingData.js`

약 10~12개 대표 식재료(계란, 양파, 대파, 두부, 삼겹살, 닭가슴살 등) 목 데이터.
```js
export const mockIngredients = [
  {
    id: 1,
    name: "계란",
    unit: "30개입",
    category: "단백질",
    naver: { price: 6500, productName: "...", link: "#", mall: "쿠팡" },
    coupang: { price: 6200, productName: "...", link: "#", mall: "쿠팡" },
  },
  // ...
];
```

---

### 2. 최저가 비교 페이지
**파일:** `src/app/ingredients-price/page.jsx`

- `PrivateLayout` 으로 감싸기 (다른 페이지와 동일 패턴)
- 상단: 제목 + 검색 입력창 (재료명 필터링)
- 본문: 카드 그리드 — 재료마다 네이버 가격 / 쿠팡 가격 표시
  - 두 가격 중 낮은 쪽을 초록색 배지로 "최저가" 하이라이트
  - 각 가격 클릭 시 해당 쇼핑 페이지 새 탭으로 이동 (목 데이터는 `href="#"`)
- 하단 안내 문구: "실제 API 연동 전 샘플 데이터입니다"

---

### 3. 사이드바 메뉴 추가
**파일:** `src/components/layout/private/Sidebar.jsx`

```js
const menus = [
  { name: "재료 관리", path: "./fridge" },
  { name: "전체레시피", path: "./recipes" },
  { name: "커뮤니티", path: "./community" },
  { name: "추천레시피", path: "./recommendations" },
  { name: "최저가 비교", path: "./ingredients-price" },  // 추가
];
```

---

### 4. 실제 API 연동 구조 (뼈대만 준비)
**파일:** `src/api/shoppingApi.js`

실제 API 키 발급 후 바로 연동할 수 있도록 함수 구조만 작성.
```js
// 네이버 쇼핑 검색 API 호출 (Next.js API Route 경유)
export async function searchNaverShopping(query) { ... }

// 쿠팡 파트너스 API 호출 (Next.js API Route 경유)
export async function searchCoupang(query) { ... }
```

**파일:** `src/app/api/shopping/naver/route.js`  
서버사이드 프록시 — 브라우저에 API 키 노출 방지용 Next.js Route Handler (뼈대).

**파일:** `src/app/api/shopping/coupang/route.js`  
동일 목적의 쿠팡 프록시 (뼈대).

---

## 수정/생성 파일 목록

| 유형 | 파일 |
|------|------|
| 생성 | `src/data/mockShoppingData.js` |
| 생성 | `src/app/ingredients-price/page.jsx` |
| 수정 | `src/components/layout/private/Sidebar.jsx` |
### [메모] 수정 말고 생성 -> Sidebar2
| 생성 | `src/api/shoppingApi.js` (뼈대) |
| 생성 | `src/app/api/shopping/naver/route.js` (뼈대) |
| 생성 | `src/app/api/shopping/coupang/route.js` (뼈대) |

---

## 재사용할 기존 패턴

- `src/app/fridge/page.jsx` — PrivateLayout 감싸기 패턴 참고
- `src/config/axios.js` — 실제 API 연동 시 axios 인스턴스 활용
- 색상 테마: `#fdfaf6` (배경), `#f6f1ea` (카드 배경), `#3f3a36` (텍스트)
- Tailwind CSS + Ant Design 컴포넌트 사용 가능

---

## .env 추가 항목 안내 (실제 연동 시)
```
NAVER_CLIENT_ID=발급받은_아이디
NAVER_CLIENT_SECRET=발급받은_시크릿
COUPANG_ACCESS_KEY=발급받은_키
COUPANG_SECRET_KEY=발급받은_시크릿
```
네이버: https://developers.naver.com → 쇼핑 검색 API 신청  
쿠팡: https://partners.coupang.com → 파트너스 가입 후 API 키 발급

---

## 검증 방법

1. `npm run dev` 실행
2. 로그인 후 사이드바에 "최저가 비교" 메뉴 확인
3. `/ingredients-price` 페이지 접속 → 샘플 카드 표시 확인
4. 검색 입력 → 재료명 필터링 동작 확인
5. "최저가" 배지 표시 정확도 확인 (낮은 가격 쪽 하이라이트)
