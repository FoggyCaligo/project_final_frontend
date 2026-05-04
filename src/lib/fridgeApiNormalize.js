/** API 응답이 camelCase / snake_case 혼용될 때 냉장고 식재료 필드 정규화 */
export function normalizeIngredientItem(raw) {
    if (!raw || typeof raw !== "object") {
        return {};
    }
    return {
        ingredientId: raw.ingredientId ?? raw.ingredient_id,
        name: raw.name,
        expirationDate: raw.expirationDate ?? raw.expiration_date,
        quantity: raw.quantity,
        unit: raw.unit,
        storageType: raw.storageType ?? raw.storage_type,
        freshnessStatus: raw.freshnessStatus ?? raw.freshness_status,
        categoryId: raw.categoryId ?? raw.category_id,
        category: raw.category,
        imageFileId: raw.imageFileId ?? raw.image_file_id,
        imageStoragePath: raw.imageStoragePath ?? raw.image_storage_path,
        imageStoredName: raw.imageStoredName ?? raw.image_stored_name,
    };
}
