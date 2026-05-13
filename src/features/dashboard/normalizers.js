export const toArray = (value) => (Array.isArray(value) ? value : []);

//  냉장고  화면에 사용하는 파라미터
export function normalizeIngredient(item = {}) {
  const quantity = item.quantity ?? item.qty ?? "-";
  const unit = item.unit ?? "";

  return {
    id:
      item.ingredientId ??
      item.id ??
      item.userIngredientId ??
      item.user_ingredient_id ??
      item.name ??
      item.rawName ??
      item.raw_name,
    name:
      item.name ??
      item.ingredientName ??
      item.rawName ??
      item.raw_name ??
      item.normalizedNameSnapshot ??
      item.normalized_name_snapshot ??
      "이름 없는 재료",
    quantity: unit && quantity !== "-" ? `${quantity}${unit}` : quantity,
    expirationDate: item.expirationDate ?? item.expire ?? item.expiresAt ?? item.expires_at ?? null,
    freshnessStatus: item.freshnessStatus ?? item.freshness_status ?? "",
    storageType: item.storageType ?? item.storage_type ?? "",
  };
}

//  레시피 화면에 사용하는 파라미터
export function normalizeRecipe(recipe = {}) {
  return {
    id: recipe.recipeId ?? recipe.id ?? recipe.title,
    title: recipe.title ?? recipe.name ?? "이름 없는 레시피",
    cookTime: recipe.cookTime ?? recipe.cookTimeText ?? recipe.cook_time_text ?? recipe.time ?? "정보 없음",
    difficulty: recipe.difficulty ?? "보통",
    thumbnailUrl: recipe.thumbnailUrl ?? recipe.thumbnail_url ?? recipe.imageURL ?? null,
    matchRate: recipe.matchRate,
    reason: recipe.reason ?? recipe.summary,
    conditionTags: recipe.conditionTags ?? [],
    missingIngredients: recipe.missingIngredients ?? [],
  };
}

