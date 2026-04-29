import { fridgeApi } from "@/api/fridgeApi";
import { getBookmarkedRecipes } from "@/api/bookmarkApi";
import { getUserPosts } from "@/api/postApi";
import { getMeApi } from "@/api/authApi";
import { initialMyPageData } from "./constants";
import {
  getCountFromList,
  normalizeFridgeSummary,
  normalizePost,
  normalizeProfile,
  normalizeRecipe,
  toArray,
  unwrapApiData,
} from "./normalizers";

function addRejectedSource(errors, result, label) {
  if (result.status === "rejected") {
    errors.push(label);
  }
}

async function requestCurrentProfile() {
  const response = await getMeApi();
  return normalizeProfile(unwrapApiData(response, null));
}

export async function requestMyPageData() {
  let profile = null;

  try {
    profile = await requestCurrentProfile();
  } catch (error) {
    return {
      ...initialMyPageData,
      authRequired: true,
      errors: [error?.message ?? "로그인 정보를 확인하지 못했습니다."],
    };
  }

  const userScopedRequests = profile.userId
    ? [getUserPosts(profile.userId), getBookmarkedRecipes(profile.userId)]
    : [Promise.resolve([]), Promise.resolve([])];

  const [summaryResult, postsResult, bookmarksResult] = await Promise.allSettled([
    fridgeApi.getSummary(),
    ...userScopedRequests,
  ]);

  const errors = [];
  addRejectedSource(errors, summaryResult, "냉장고 요약");
  addRejectedSource(errors, postsResult, "작성 후기");
  addRejectedSource(errors, bookmarksResult, "북마크 레시피");

  if (!profile.userId) {
    errors.push("사용자 ID 기반 활동");
  }

  const fridgeSummary =
    summaryResult.status === "fulfilled"
      ? normalizeFridgeSummary(unwrapApiData(summaryResult.value, null))
      : normalizeFridgeSummary(null);

  const recentPosts =
    postsResult.status === "fulfilled"
      ? toArray(postsResult.value).map(normalizePost)
      : [];

  const bookmarkedRecipes =
    bookmarksResult.status === "fulfilled"
      ? toArray(bookmarksResult.value).map(normalizeRecipe)
      : [];

  return {
    profile,
    activity: {
      ingredientCount: fridgeSummary.total,
      bookmarkCount:
        bookmarksResult.status === "fulfilled"
          ? getCountFromList(bookmarksResult.value)
          : null,
      postCount:
        postsResult.status === "fulfilled"
          ? getCountFromList(postsResult.value)
          : null,
    },
    recentPosts,
    bookmarkedRecipes,
    errors,
    authRequired: false,
  };
}
