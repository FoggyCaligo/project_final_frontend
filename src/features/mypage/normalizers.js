const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);

export function unwrapApiData(response, fallback = null) {
  return response?.data?.data ?? response?.data ?? fallback;
}

export function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

export function normalizeProfile(payload) {
  const profile = payload ?? {};

  return {
    userId: firstDefined(profile.userId, profile.id, null),
    loginId: firstDefined(profile.loginId, ""),
    email: firstDefined(profile.email, ""),
    nickname: firstDefined(profile.nickname, profile.name, profile.loginId, "회원"),
    profileImageUrl: firstDefined(profile.profileImageUrl, profile.profileImage, profile.imageUrl, ""),
    status: firstDefined(profile.status, ""),
    emailVerified: Boolean(firstDefined(profile.emailVerified, false)),
    lastLoginAt: firstDefined(profile.lastLoginAt, null),
    createdAt: firstDefined(profile.createdAt, null),
  };
}

export function normalizeFridgeSummary(payload) {
  const summary = payload ?? {};

  return {
    total: Number(firstDefined(summary.total, summary.totalCount, summary.ingredientCount, 0)),
    soon: Number(firstDefined(summary.soon, summary.soonCount, 0)),
    expired: Number(firstDefined(summary.expired, summary.expiredCount, 0)),
  };
}

export function normalizePost(item) {
  return {
    id: firstDefined(item?.postId, item?.id, item?.post_id),
    title: firstDefined(item?.title, "제목 없는 후기"),
    createdAt: firstDefined(item?.createdAt, item?.created_at, null),
  };
}

export function normalizeRecipe(item) {
  return {
    id: firstDefined(item?.recipeId, item?.id, item?.recipe_id),
    title: firstDefined(item?.title, item?.name, item?.recipeName, "레시피"),
    summary: firstDefined(item?.summary, item?.description, ""),
  };
}

export function getCountFromList(value) {
  const list = toArray(value);
  return list.length;
}
