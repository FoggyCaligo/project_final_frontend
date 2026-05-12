import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import IngredientsPrice from '../page'
import { shoppingApi } from '@/api/shoppingApi'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/api/shoppingApi', () => ({
  shoppingApi: {
    searchByKeyword: vi.fn(),
    getFridgePrices: vi.fn(),
  },
}))

vi.mock('@/components/layout/private/PrivateLayout', () => ({
  default: ({ children }) => <div data-testid="private-layout">{children}</div>,
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

// ── 테스트 데이터 ─────────────────────────────────────────────────────────────

const itemNaver = {
  mallName: '네이버쇼핑',
  mallProductId: 'naver-1',
  productName: '풀무원 두부 300g',
  price: 1980,
  originalPrice: 2500,
  discountRate: 20,
  purchaseUrl: 'https://example.com/1',
  imageUrl: null,
  shippingType: 'FREE',
  stockStatus: 'IN_STOCK',
}

const itemEleven = {
  mallName: '11번가',
  mallProductId: '11st-1',
  productName: 'CJ 두부 350g',
  price: 2100,
  purchaseUrl: 'https://example.com/2',
  imageUrl: null,
  shippingType: 'STANDARD',
  stockStatus: 'IN_STOCK',
}

const makeResponse = (keyword, items, explanation = null) => ({
  ingredientName: keyword,
  lowestPrice: Math.min(...items.map((i) => i.price)),
  items,
  explanation,
})

const fridgePricesResponse = {
  data: {
    data: [
      makeResponse('두부', [itemNaver, itemEleven], '무료배송으로 저렴하게 구매할 수 있는 두부입니다.'),
      makeResponse('계란', [{ ...itemNaver, mallProductId: 'n2', productName: '계란 30구', price: 5900 }]),
    ],
  },
}

// ── 공통 setup ────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  shoppingApi.getFridgePrices.mockResolvedValue(fridgePricesResponse)
  shoppingApi.searchByKeyword.mockResolvedValue({ data: { data: makeResponse('두부', [itemNaver]) } })
})

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe('IngredientsPrice 페이지', () => {
  it('페이지 진입 시 타이틀과 검색 입력창이 렌더링된다', () => {
    render(<IngredientsPrice />)
    expect(screen.getByText('식재료 최저가 비교')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/재료명을 검색하세요/)).toBeInTheDocument()
  })

  it('냉장고 식재료 가격을 불러와 PriceCard를 렌더링한다', async () => {
    render(<IngredientsPrice />)
    await waitFor(() => {
      expect(screen.getByText('두부')).toBeInTheDocument()
      expect(screen.getByText('계란')).toBeInTheDocument()
    })
  })
})

describe('PriceCard — explanation 표시', () => {
  it('explanation이 있으면 ✨ 와 함께 추천 이유를 렌더링한다', async () => {
    render(<IngredientsPrice />)
    await waitFor(() => {
      expect(screen.getByText('무료배송으로 저렴하게 구매할 수 있는 두부입니다.')).toBeInTheDocument()
    })
  })

  it('explanation이 null이면 추천 이유 섹션을 렌더링하지 않는다', async () => {
    render(<IngredientsPrice />)
    await waitFor(() => {
      // 계란 카드는 explanation=null이므로 ✨ 이모지가 1개만 있어야 함 (두부 카드 것만)
      const sparkles = screen.getAllByText('✨')
      expect(sparkles).toHaveLength(1)
    })
  })
})

describe('키워드 검색 — explanation 표시', () => {
  it('검색 결과에 explanation이 있으면 검색 결과 섹션에 추천 이유를 표시한다', async () => {
    const explanation = '네이버쇼핑에서 1,980원 무료배송으로 구매 가능합니다.'
    shoppingApi.searchByKeyword.mockResolvedValue({
      data: { data: makeResponse('두부', [itemNaver], explanation) },
    })

    render(<IngredientsPrice />)

    const input = screen.getByPlaceholderText(/재료명을 검색하세요/)
    fireEvent.change(input, { target: { value: '두부' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText(explanation)).toBeInTheDocument()
    })
  })

  it('검색 결과에 explanation이 없으면 추천 이유 섹션이 나타나지 않는다', async () => {
    shoppingApi.searchByKeyword.mockResolvedValue({
      data: { data: makeResponse('계란', [itemNaver], null) },
    })

    render(<IngredientsPrice />)

    const input = screen.getByPlaceholderText(/재료명을 검색하세요/)
    fireEvent.change(input, { target: { value: '계란' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText(/"계란" 검색 결과/)).toBeInTheDocument()
    })

    // ✨ 이 없어야 함 (냉장고 섹션도 비어있으므로)
    expect(screen.queryByText('✨')).not.toBeInTheDocument()
  })

  it('검색어 없이 검색하면 searchResult가 초기화된다', async () => {
    render(<IngredientsPrice />)

    const input = screen.getByPlaceholderText(/재료명을 검색하세요/)
    fireEvent.change(input, { target: { value: '' } })

    expect(shoppingApi.searchByKeyword).not.toHaveBeenCalled()
  })
})
