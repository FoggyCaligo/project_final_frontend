"use client";

import { useState, useEffect, useCallback } from "react";
import PrivateLayout2 from "@/components/layout/private/PrivateLayout2";
import { shoppingApi3 } from "@/api/shoppingApi3";
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

  // 검색 결과 (키워드 검색용)
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await shoppingApi3.getFridgePrices();
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

  // 키워드 검색: Enter 또는 검색 버튼 클릭 시 실행
  const handleSearch = useCallback(async () => {
    const keyword = search.trim();
    if (!keyword) {
      setSearchResult(null);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await shoppingApi3.searchByKeyword(keyword);
      const data = res.data?.data || res.data;
      setSearchResult(data);
    } catch (err) {
      console.error("키워드 검색 실패:", err?.message);
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  }, [search]);

  // 검색어가 비면 검색 결과 초기화
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResult(null);
    }
  };

  const filtered = priceData.filter((item) =>
    item.ingredientName?.includes(search.trim())
  );

  // 검색 결과가 있으면 검색 결과를 우선 표시
  const showSearchResult = searchResult && searchResult.items && searchResult.items.length > 0;

  return (
    <PrivateLayout2>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#3f3a36]">식재료 최저가 비교</h1>
            {isMock && searchResult === null && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                샘플 데이터
              </span>
            )}
            {showSearchResult && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">
                ✨ 실시간 검색
              </span>
            )}
          </div>
          <p className="text-sm text-[#8a8078] mt-1">
            식재료명을 입력하고 검색 버튼을 누르면 실시간 최저가를 비교할 수 있습니다
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="재료명을 검색하세요 (예: 계란, 대파)"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full max-w-md rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: "#f6f1ea",
              border: "1px solid #e0d8cf",
              color: "#3f3a36",
            }}
          />
          {/* 실시간 검색 버튼 */}
          <button
            onClick={handleSearch}
            disabled={searchLoading || !search.trim()}
            className="rounded-xl px-4 py-3 text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ 
              backgroundColor: search.trim() ? "#4ade80" : "#f6f1ea", 
              border: "1px solid #e0d8cf", 
              color: search.trim() ? "#ffffff" : "#3f3a36" 
            }}
          >
            {searchLoading ? "검색 중..." : "🔍 실시간 검색"}
          </button>
          {/* 냉장고 데이터 새로고침 */}
          <button
            onClick={fetchPrices}
            className="rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#f6f1ea", border: "1px solid #e0d8cf", color: "#3f3a36" }}
          >
            🔄 냉장고
          </button>
        </div>

        {/* 실시간 검색 결과 표시 */}
        {searchLoading && (
          <div className="text-center py-8 text-[#8a8078]">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-400 border-t-transparent mb-2" />
            <p>&quot;{search}&quot; 실시간 최저가를 검색하고 있습니다...</p>
            <p className="text-xs mt-1">네이버쇼핑 + 쿠팡에서 동시 검색 중</p>
          </div>
        )}

        {showSearchResult && !searchLoading && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-[#3f3a36]">
                &quot;{searchResult.ingredientName}&quot; 검색 결과
              </h2>
              <span className="text-xs text-[#b0a899]">
                {searchResult.items.length}개 상품
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PriceCard data={searchResult} />
            </div>
          </div>
        )}

        {searchResult && searchResult.items?.length === 0 && !searchLoading && (
          <div className="text-center py-8 text-[#8a8078]">
            &quot;{searchResult.ingredientName}&quot;에 대한 검색 결과가 없습니다.
          </div>
        )}

        {/* 구분선 (검색 결과와 냉장고 데이터 사이) */}
        {showSearchResult && !searchLoading && filtered.length > 0 && (
          <hr className="border-[#e0d8cf]" />
        )}

        {/* 기존 냉장고 데이터 */}
        {!showSearchResult && loading && (
          <div className="text-center py-16 text-[#8a8078]">
            가격 정보를 불러오는 중입니다...
          </div>
        )}

        {searchResult === null && !loading && filtered.length === 0 && (
          <div className="text-center py-16 text-[#8a8078]">
            {search ? "검색 결과가 없습니다." : "냉장고에 등록된 재료가 없습니다."}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div>
            {showSearchResult && (
              <h2 className="text-lg font-semibold text-[#3f3a36] mb-3">📦 냉장고 식재료</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((data) => (
                <PriceCard key={data.ingredientId} data={data} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PrivateLayout2>
  );
}
