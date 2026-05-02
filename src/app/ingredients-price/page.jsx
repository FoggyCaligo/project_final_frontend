"use client";

import { useState, useEffect, useCallback } from "react";
import PrivateLayout2 from "@/components/layout/private/PrivateLayout2";
import { shoppingApi } from "@/api/shoppingApi";

const SHIPPING_LABEL = {
  FREE: "무료배송",
  STANDARD: "표준배송",
  EXPRESS: "빠른배송",
  NEXT_DAY: "내일도착",
};

const STOCK_STYLE = {
  IN_STOCK: { label: "재고있음", color: "text-green-600" },
  LOW_STOCK: { label: "재고부족", color: "text-orange-500" },
  OUT_OF_STOCK: { label: "품절", color: "text-red-500" },
};

function ShoppingItemRow({ item, isLowest }) {
  return (
    <a
      href={item.purchaseUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl px-4 py-3 transition-opacity hover:opacity-80"
      style={{ backgroundColor: "#ffffff60", border: "1px solid #e0d8cf" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#8a8078]">{item.mallName}</span>
          <span className="text-sm text-[#3f3a36] truncate max-w-[160px]">
            {item.productName}
          </span>
          <div className="flex gap-2 mt-0.5">
            {item.shippingType && (
              <span className="text-xs text-[#b0a899]">
                {SHIPPING_LABEL[item.shippingType] ?? item.shippingType}
              </span>
            )}
            {item.stockStatus && STOCK_STYLE[item.stockStatus] && (
              <span className={`text-xs ${STOCK_STYLE[item.stockStatus].color}`}>
                {STOCK_STYLE[item.stockStatus].label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {isLowest && (
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white bg-green-500">
            최저가
          </span>
        )}
        <div className="flex flex-col items-end">
          <span className="font-bold text-[#3f3a36]">
            {item.price?.toLocaleString()}원
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-[#b0a899] line-through">
              {item.originalPrice.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function PriceCard({ data }) {
  const lowestPrice = data.lowestPrice;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: "#f6f1ea" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#3f3a36]">{data.ingredientName}</span>
        <span className="text-sm font-semibold text-green-600">
          최저 {lowestPrice?.toLocaleString()}원~
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {data.items?.map((item, idx) => (
          <ShoppingItemRow
            key={item.mallProductId ?? idx}
            item={item}
            isLowest={item.price === lowestPrice}
          />
        ))}
      </div>
    </div>
  );
}

export default function IngredientsPrice() {
  const [search, setSearch] = useState("");
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await shoppingApi.getFridgePrices();
      
      // 백엔드 응답이 res.data 형태이거나 res.data.data 형태일 수 있으므로 배열인지 검증합니다.
      const dataPayload = res.data?.data || res.data;
      const list = Array.isArray(dataPayload) ? dataPayload : [];
      
      setPriceData(list);
    } catch (err) {
      setError(err?.message ?? "가격 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const filtered = priceData.filter((item) =>
    item.ingredientName?.includes(search.trim())
  );

  return (
    <PrivateLayout2>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3f3a36]">식재료 최저가 비교</h1>
          <p className="text-sm text-[#8a8078] mt-1">
            냉장고에 있는 재료들의 최저가를 한눈에 비교해보세요
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="재료명을 검색하세요 (예: 계란, 대파)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: "#f6f1ea",
              border: "1px solid #e0d8cf",
              color: "#3f3a36",
            }}
          />
          <button
            onClick={fetchPrices}
            className="rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#f6f1ea", border: "1px solid #e0d8cf", color: "#3f3a36" }}
          >
            새로고침
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-[#8a8078]">
            가격 정보를 불러오는 중입니다...
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-[#8a8078]">
            {search ? "검색 결과가 없습니다." : "냉장고에 등록된 재료가 없습니다."}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((data) => (
              <PriceCard key={data.ingredientId} data={data} />
            ))}
          </div>
        )}
      </div>
    </PrivateLayout2>
  );
}
