/**
 * FridgeIngredientService.HEURISTIC_CATEGORY_KEYWORDS 와 동일 순서·키워드.
 * 인식 후보 선택 시 카테고리 자동 반영에 사용.
 */
const HEURISTIC_CATEGORY_KEYWORDS = [
    [
        "VEGETABLE",
        "당근",
        "양파",
        "감자",
        "토마토",
        "마늘",
        "오이",
        "배추",
        "상추",
        "양상추",
        "브로콜리",
        "버섯",
        "섬초",
        "피망",
        "파프리카",
        "시금치",
        "무",
        "순무",
        "깻잎",
        "쪽파",
        "대파",
        "아스파라거스",
        "가지",
        "애호박",
        "생강",
        "양배추",
        "케일",
        "청경채",
        "콩나물",
        "숙주",
        "미나리",
        "시래기",
    ],
    [
        "MEAT",
        "돼지고기",
        "돼지",
        "삼겹살",
        "목살",
        "소고기",
        "쇠고기",
        "한우",
        "닭고기",
        "닭가슴살",
        "가슴살",
        "닭",
        "오리고기",
        "양고기",
        "베이컨",
        "햄",
        "소세지",
        "소시지",
        "육류",
    ],
    ["SEAFOOD", "생선", "연어", "고등어", "새우", "게", "조개", "멸치", "참치", "오징어", "문어", "해산물"],
    ["DAIRY", "우유", "치즈", "버터", "요거트", "요구르트", "두유", "크림"],
    ["GRAIN", "쌀", "밀가루", "빵", "면", "파스타", "라면"],
];

/**
 * @param {string} rawName 재료명 (후보 displayName 등)
 * @param {Array<{ categoryId?: number, category_id?: number, categoryCode?: string, category_code?: string }>} categories GET /fridge/categories
 * @returns {number | null}
 */
export function inferCategoryIdFromIngredientName(rawName, categories) {
    if (!rawName || !Array.isArray(categories) || categories.length === 0) {
        return null;
    }
    const n = String(rawName).trim();
    if (!n) {
        return null;
    }
    for (const row of HEURISTIC_CATEGORY_KEYWORDS) {
        const code = row[0];
        for (let i = 1; i < row.length; i++) {
            const kw = row[i];
            if (n.includes(kw)) {
                const cat = categories.find(
                    (c) =>
                        (c.categoryCode && c.categoryCode === code) ||
                        (c.category_code && c.category_code === code)
                );
                if (cat == null) {
                    return null;
                }
                const id = cat.categoryId ?? cat.category_id;
                return id != null ? Number(id) : null;
            }
        }
    }
    return null;
}
