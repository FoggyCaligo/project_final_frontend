import { buildDashboardView } from "@/features/dashboard/dashboardModel";

describe("buildDashboardView", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T09:00:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
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
      errors: [],
    });

    expect(view.summaryCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "total", value: 4 }),
        expect.objectContaining({ key: "soon", value: 1 }),
        expect.objectContaining({ key: "expired", value: 1 }),
        expect.objectContaining({ key: "recipes", value: 4 }),
      ]),
    );
    expect(view.soonItems).toHaveLength(1);
    expect(view.soonItems[0]).toEqual(expect.objectContaining({ id: 1, name: "milk", quantity: "1L" }));
    expect(view.soonTotalCount).toBe(1);
    expect(view.recipes.map((recipe) => recipe.title)).toEqual(["fried rice", "salad", "soup"]);
    expect(view.personalizationSignals).toEqual({
      hasFridgeData: true,
      hasUrgentIngredients: true,
      hasRecommendations: true,
    });
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
      errors: ["dashboard"],
    });

    expect(view.soonItems).toHaveLength(1);
    expect(view.soonItems[0]).toEqual(expect.objectContaining({ id: "summary-item", name: "summary milk" }));
    expect(view.soonTotalCount).toBe(2);
    expect(view.notices).toEqual(expect.arrayContaining([expect.objectContaining({ id: "error-dashboard" })]));
  });
});
