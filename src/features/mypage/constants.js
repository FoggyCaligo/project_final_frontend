export const initialMyPageData = {
  profile: null,
  activity: {
    ingredientCount: null,
    bookmarkCount: null,
    postCount: null,
  },
  recentPosts: [],
  bookmarkedRecipes: [],
  errors: [],
  authRequired: false,
};

export const myPageQuickLinks = [
  {
    id: "fridge",
    label: "냉장고 관리",
    href: "/fridge",
    desc: "식재료 등록과 유통기한 확인",
  },
  {
    id: "recommendations",
    label: "추천 레시피",
    href: "/recommendations",
    desc: "보유 재료 기반 메뉴 확인",
  },
  {
    id: "community",
    label: "커뮤니티",
    href: "/community",
    desc: "요리 후기 작성과 확인",
  },
];

export const accountSettingItems = [
  {
    id: "profile",
    label: "프로필 정보",
    desc: "닉네임과 프로필 이미지를 관리합니다.",
    status: "API 대기",
  },
  {
    id: "preferences",
    label: "식단 조건",
    desc: "추천에 반영할 개인 조건을 관리합니다.",
    status: "연동 예정",
  },
  {
    id: "security",
    label: "계정 보안",
    desc: "비밀번호와 로그인 세션을 확인합니다.",
    status: "연동 예정",
  },
];
