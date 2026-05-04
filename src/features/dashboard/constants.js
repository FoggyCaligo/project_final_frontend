export const dashboardQuickLinks = [
  { id: "fridge", label: "냉장고 관리", href: "/fridge", desc: "재료 등록과 유통기한 확인" },
  { id: "recommend", label: "추천 레시피", href: "/recommendations", desc: "보유 재료 기반 메뉴 보기" },
  { id: "recipes", label: "전체 레시피", href: "/recipes", desc: "전체 레시피 목록 탐색" },
  { id: "community", label: "커뮤니티", href: "/community", desc: "요리 후기와 팁 확인" },
];

export const initialDashboardData = {
  summary: null,
  ingredients: [],
  recipes: [],
  profile: null,
  activityLogs: [],
  personalization: null,
  errors: [],
};

