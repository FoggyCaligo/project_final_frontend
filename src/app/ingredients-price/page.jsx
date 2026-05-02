"use client";

import { useState, useEffect, useCallback } from "react";
import PrivateLayout2 from "@/components/layout/private/PrivateLayout2";
import { shoppingApi } from "@/api/shoppingApi";
import { mockPriceData } from "@/data/mockShoppingData2";
import PropTypes from "prop-types";

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
        
        {/* onError 핸들러로 외부 이미지 로드 실패시 자동 숨김 */}
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.productName || "상품 이미지"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
        {/* 네이버 , 11번가 등 mallName */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-[#8a8078]">{item.mallName}</span>
          {/* 상품이름 */}
          <span className="text-sm text-[#3f3a36] truncate max-w-[160px]">
            {item.productName}
          </span>
          {/* 무료 배송이나 배송 날짜 등 쇼핑정보 */}
          <div className="flex gap-2 mt-0.5">
            {item.shippingType && (
              <span className="text-xs text-[#b0a899]">
                {SHIPPING_LABEL[item.shippingType] ?? item.shippingType}
              </span>
            )}
            {/* 품절, 재고 여부 표시 */}
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

ShoppingItemRow.propTypes = {
  item: PropTypes.shape({
    purchaseUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    productName: PropTypes.string,
    mallName: PropTypes.string,
    shippingType: PropTypes.string,
    stockStatus: PropTypes.string,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
  }).isRequired,
  isLowest: PropTypes.bool.isRequired,
};

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

PriceCard.propTypes = {
  data: PropTypes.shape({
    ingredientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ingredientName: PropTypes.string,
    lowestPrice: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default function IngredientsPrice() {
  const [search, setSearch] = useState("");
  // 실제 DB 연결전 목데이터로 테스트  
  const [priceData, setPriceData] = useState(mockPriceData);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(true);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await shoppingApi.getFridgePrices();
      const dataPayload = res.data?.data || res.data;
      const list = Array.isArray(dataPayload) ? dataPayload : [];
      if (list.length > 0) {
        setPriceData(list);
        setIsMock(false);
      }
    } catch (err) {
      console.error("가격 정보 조회 실패:", err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPrices();
  }, [fetchPrices]);

  const filtered = priceData.filter((item) =>
    item.ingredientName?.includes(search.trim())
  );

  return (
    <PrivateLayout2>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#3f3a36]">식재료 최저가 비교</h1>
            {isMock && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                샘플 데이터
              </span>
            )}
          </div>
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
          {/* 새로고침 버튼 : fetchPRices 실행  - api 재호출, 실제 가격 정보 갱신, 목데이터일때는 계속 샘플 데이터로 보이고 실제 데이터가 오면 셈플 데이터 배지 제거 */}
          <button
            onClick={fetchPrices}
            className="rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#f6f1ea", border: "1px solid #e0d8cf", color: "#3f3a36" }}
          >
            실시간 가격 보기
          </button>
        </div>

        {loading && (
          <div className="text-center py-16 text-[#8a8078]">
            가격 정보를 불러오는 중입니다...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-[#8a8078]">
            {search ? "검색 결과가 없습니다." : "냉장고에 등록된 재료가 없습니다."}
          </div>
        )}

        {!loading && filtered.length > 0 && (
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
