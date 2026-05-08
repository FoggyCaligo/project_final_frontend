import {
  getCountFromList,
  normalizeFridgeSummary,
  normalizePost,
  normalizeProfile,
  normalizeRecipe,
  toArray,
  unwrapApiData,
} from "@/features/mypage/normalizers";

describe("mypage normalizers", () => {
  it("unwraps common API response shapes", () => {
    expect(unwrapApiData({ data: { data: { ok: true } } })).toEqual({ ok: true });
    expect(unwrapApiData({ data: { ok: true } })).toEqual({ ok: true });
    expect(unwrapApiData(null, "fallback")).toBe("fallback");
  });

  it("converts paged or wrapped list payloads to arrays", () => {
    expect(toArray([{ id: 1 }])).toEqual([{ id: 1 }]);
    expect(toArray({ items: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    expect(toArray({ content: [{ id: 3 }] })).toEqual([{ id: 3 }]);
    expect(toArray({ data: [{ id: 4 }] })).toEqual([{ id: 4 }]);
    expect(toArray({ value: [] })).toEqual([]);
  });

  it("normalizes profile fallback fields", () => {
    expect(
      normalizeProfile({
        id: 7,
        loginId: "dongjoo",
        email: "dongjoo@example.com",
        name: "Dongjoo",
        profileImage: "/profile.png",
      }),
    ).toEqual(
      expect.objectContaining({
        userId: 7,
        loginId: "dongjoo",
        email: "dongjoo@example.com",
        nickname: "Dongjoo",
        profileImageUrl: "/profile.png",
      }),
    );
  });

  it("normalizes activity counts and recent item summaries", () => {
    expect(normalizeFridgeSummary({ ingredientCount: "8", soonCount: "2", expiredCount: "1" })).toEqual({
      total: 8,
      soon: 2,
      expired: 1,
    });
    expect(normalizePost({ post_id: 3, title: "notice", created_at: "2026-05-07" })).toEqual({
      id: 3,
      title: "notice",
      createdAt: "2026-05-07",
    });
    expect(normalizeRecipe({ recipe_id: 5, recipeName: "kimchi rice", description: "quick" })).toEqual({
      id: 5,
      title: "kimchi rice",
      summary: "quick",
    });
    expect(getCountFromList({ content: [{ id: 1 }, { id: 2 }] })).toBe(2);
  });
});
