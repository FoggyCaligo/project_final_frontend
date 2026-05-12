import { buildDashboardView } from "@/features/dashboard/dashboardModel";
import { vi } from "vitest";

describe("buildDashboardView", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-07T09:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds summary cards, soon items, recipes, and personalization signals", () => {
    const view = buildDashboardView({
      summary: { totalCount: 4 },
      ingredients: [
        {
          ingredientId: 1,
          ingredientName: "milk",
          quantity: 1,
          unit: "L",
          expirationDate: "2026-05-08",
          freshnessStatus: "FRESH",
        },
        {
          ingredientId: 2,
          ingredientName: "egg",
          expirationDate: "2026-05-04",
          freshnessStatus: "FRESH",
        },
      ],
      recipes: [
        { recipeId: 10, title: "fried rice", cookTime: "15m" },
        { recipeId: 11, title: "salad", cookTimeText: "5m" },
        { recipeId: 12, title: "soup" },
        { recipeId: 13, title: "pasta" },
      ],
      recommendationTotalCount: 12,
      shoppingPrices: [
        {
          ingredientId: 1,
          ingredientName: "milk",
          lowestPrice: 2500,
          items: [{ mallName: "shop", productName: "fresh milk", price: 2500 }],
        },
      ],
      errors: [],
    });

    expect(view.summaryCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "total", value: 4 }),
        expect.objectContaining({ key: "soon", value: 1 }),
        expect.objectContaining({ key: "expired", value: 1 }),
        expect.objectContaining({ key: "recipes", value: 12 }),
      ]),
    );
    expect(view.soonItems).toHaveLength(1);
    expect(view.soonItems[0]).toEqual(expect.objectContaining({ id: 1, name: "milk", quantity: "1L" }));
    expect(view.soonTotalCount).toBe(1);
    expect(view.recipes.map((recipe) => recipe.title)).toEqual(["fried rice", "salad", "soup", "pasta"]);
    expect(view.personalizationSignals).toEqual({
      hasFridgeData: true,
      hasUrgentIngredients: true,
      hasRecommendations: true,
      hasShoppingPrices: true,
    });
    expect(view.shoppingSummary).toEqual(
      expect.objectContaining({
        totalCount: 1,
        totalLowestPrice: 2500,
        lowestItem: expect.objectContaining({ ingredientName: "milk" }),
      }),
    );
    expect(view.notices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "expired",
          title: "만료 재료 1개 확인이 필요합니다",
          href: "/fridge",
          actionLabel: "냉장고 보기",
        }),
        expect.objectContaining({
          id: "recommend",
          href: "/recommendations",
          actionLabel: "추천 보기",
        }),
      ]),
    );
  });

  it("prefers soonItems from summary when provided", () => {
    const view = buildDashboardView({
      summary: {
        soonCount: 2,
        soonItems: [{ id: "summary-item", name: "summary milk", expirationDate: "2026-05-10" }],
      },
      ingredients: [
        { id: "ignored", name: "old ingredient", expirationDate: "2026-05-08", freshnessStatus: "SOON" },
      ],
      recipes: [],
      shoppingPrices: [],
      errors: ["dashboard"],
    });

    expect(view.soonItems).toHaveLength(1);
    expect(view.soonItems[0]).toEqual(expect.objectContaining({ id: "summary-item", name: "summary milk" }));
    expect(view.soonTotalCount).toBe(2);
    expect(view.notices).toEqual(expect.arrayContaining([expect.objectContaining({ id: "error-dashboard" })]));
  });

  it("sorts dashboard recipe previews by match rate", () => {
    const view = buildDashboardView({
      summary: { totalCount: 3 },
      ingredients: [{ id: 1, name: "potato" }],
      recipes: [
        { recipeId: 1, title: "low", matchRate: 20 },
        { recipeId: 2, title: "high", matchRate: 100 },
        { recipeId: 3, title: "middle", matchRate: 75 },
        { recipeId: 4, title: "second", matchRate: 90 },
        { recipeId: 5, title: "fourth", matchRate: 60 },
        { recipeId: 6, title: "hidden", matchRate: 10 },
      ],
      recommendationTotalCount: 6,
      shoppingPrices: [],
      errors: [],
    });

    expect(view.recipes.map((recipe) => recipe.title)).toEqual(["high", "second", "middle", "fourth", "low"]);
  });

  it("hides recommendation totals when the fridge is empty", () => {
    const view = buildDashboardView({
      summary: { totalCount: 0 },
      ingredients: [],
      recipes: [{ recipeId: 10, title: "fried rice", cookTime: "15m" }],
      recommendationTotalCount: 1251,
      shoppingPrices: [],
      errors: [],
    });

    expect(view.summaryCards).toEqual(
      expect.arrayContaining([expect.objectContaining({ key: "recipes", value: 0 })]),
    );
    expect(view.recipes).toEqual([]);
    expect(view.personalizationSignals.hasRecommendations).toBe(false);
  });
});
