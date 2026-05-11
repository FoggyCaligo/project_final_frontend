export const dashboardQuickLinks = [
  { id: "fridge", label: "냉장고 관리", href: "/fridge", desc: "식재료 등록과 유통기한 확인" },
  { id: "recommend", label: "추천 레시피", href: "/recommendations", desc: "보유 식재료 기반 메뉴 보기" },
  { id: "recipes", label: "전체 레시피", href: "/recipes", desc: "전체 레시피 목록 탐색" },
  { id: "prices", label: "최저가 비교", href: "/ingredients-price", desc: "냉장고 식재료 쇼핑 가격 확인" },
  { id: "chat", label: "AI 추천 채팅", href: "/chat", desc: "대화로 레시피 추천 받기" },
  { id: "community", label: "커뮤니티", href: "/community", desc: "요리 후기와 팁 확인" },
];

export const initialDashboardData = {
  summary: null,
  ingredients: [],
  recipes: [],
  recommendationTotalCount: 0,
  shoppingPrices: [],
  profile: null,
  activityLogs: [],
  personalization: null,
  errors: [],
};
