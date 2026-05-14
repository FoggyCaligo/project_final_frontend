"use client";

import { useEffect, useState } from "react";
import { shoppingApi } from "@/api/shoppingApi";

const SHIPPING_LABEL = {
  FREE: "무료배송",
  STANDARD: "배송비 있음",
  EXPRESS: "빠른배송",
  NEXT_DAY: "내일도착",
};

const MALL_COLOR = {
  네이버쇼핑: { bg: "#03C75A", text: "#fff", symbol: "N" },
  "11번가": { bg: "#E0001B", text: "#fff", symbol: "11" },
};

function MallBadge({ mallName }) {
  const style = MALL_COLOR[mallName] ?? { bg: "#888", text: "#fff", symbol: "?" };
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-xs font-bold px-2 py-0.5 mr-1"
      style={{ backgroundColor: style.bg, color: style.text, minWidth: 32 }}
    >
      {style.symbol}
    </span>
  );
}

function IngredientShoppingCard({ data }) {
  const lowestItem = data.items?.[0];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800 text-base">{data.ingredientName}</span>
        {data.lowestPrice != null && (
          <span className="text-sm font-bold text-emerald-600">
            최저 {data.lowestPrice.toLocaleString()}원
          </span>
        )}
      </div>

      {lowestItem ? (
        <div className="flex items-center gap-2">
          <MallBadge mallName={lowestItem.mallName} />
          <span className="text-sm text-gray-600 truncate flex-1">{lowestItem.productName}</span>
          <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
            {lowestItem.price?.toLocaleString()}원
          </span>
          {lowestItem.shippingType && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {SHIPPING_LABEL[lowestItem.shippingType] ?? lowestItem.shippingType}
            </span>
          )}
          {lowestItem.purchaseUrl && (
            <a
              href={lowestItem.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 underline whitespace-nowrap"
            >
              구매
            </a>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">검색 결과 없음</p>
      )}
    </div>
  );
}

export default function MissingIngredientsPrices({ recipeId }) {
  const [missingPrices, setMissingPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    shoppingApi
      .getMissingIngredientsPrices(recipeId)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setMissingPrices(Array.isArray(data) ? data : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [recipeId]);

  if (loading) {
    return (
      <div className="mt-6 p-4 rounded-xl bg-gray-50 text-sm text-gray-400 text-center animate-pulse">
        재료 재고 확인 중...
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (missingPrices.length === 0) {
    return (
      <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
        <span className="text-emerald-500 text-lg">✓</span>
        <span className="text-sm text-emerald-700 font-medium">
          모든 재료가 냉장고에 있습니다
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        부족한 재료 최저가{" "}
        <span className="text-red-500">({missingPrices.length}개)</span>
      </h3>
      <div className="flex flex-col gap-3">
        {missingPrices.map((item) => (
          <IngredientShoppingCard key={item.ingredientName} data={item} />
        ))}
      </div>
    </div>
  );
}
