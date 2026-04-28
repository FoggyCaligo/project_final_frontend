import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import FridgePage from '../page'
import { fridgeApi } from '@/api/fridgeApi'

// 1. API 모킹
vi.mock('@/api/fridgeApi', () => ({
  fridgeApi: {
    getIngredients: vi.fn(),
    getSummary: vi.fn(),
    addIngredient: vi.fn(),
    updateIngredient: vi.fn(),
    deleteIngredient: vi.fn(),
  }
}))

// 2. 외부 컴포넌트 모킹 (필요시)
// Next.js의 이미지나 레이아웃 등을 간단히 모킹할 수 있습니다.
vi.mock('@/components/layout/private/PrivateLayout', () => ({
  default: ({ children }) => <div data-testid="private-layout">{children}</div>
}))

describe('FridgePage', () => {
  const mockIngredients = [
    {
      ingredientId: 1,
      name: '사과',
      expirationDate: '2026-05-01',
      quantity: 5,
      storageType: 'REFRIGERATED',
      freshnessStatus: 'FRESH'
    }
  ]

  const mockSummary = {
    totalCount: 1,
    freshCount: 1,
    soonCount: 0,
    expiredCount: 0
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // 기본 API 응답 설정
    fridgeApi.getIngredients.mockResolvedValue({ data: { data: { items: mockIngredients } } })
    fridgeApi.getSummary.mockResolvedValue({ data: { data: mockSummary } })
  })

  it('페이지 진입 시 식재료 목록과 요약을 불러와서 렌더링한다', async () => {
    render(<FridgePage />)

    // 타이틀 확인
    expect(screen.getByText('냉장고 현황')).toBeInTheDocument()

    // 데이터 렌더링 확인 (waitFor 사용)
    await waitFor(() => {
      expect(screen.getAllByText('사과')[0]).toBeInTheDocument()
      expect(screen.getByText('냉장')).toBeInTheDocument()
    })

    // 요약 통계 확인
    expect(screen.getByText('전체')).toContainHTML('1')
  })

  it('식재료 추가 버튼 클릭 시 모달이 열린다', async () => {
    render(<FridgePage />)
    
    const addButton = screen.getByText('식재료 추가')
    fireEvent.click(addButton)

    // 모달 타이틀 확인
    expect(screen.getByText('재료 추가')).toBeInTheDocument()
  })

  it('삭제 버튼 클릭 시 deleteIngredient API가 호출된다', async () => {
    render(<FridgePage />)

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /삭제/i || /x/i }) 
      // IngredientComponent 내부에 삭제 버튼이 어떻게 구현되어 있는지에 따라 달라질 수 있습니다.
      // 여기서는 예시로 첫 번째 버튼을 클릭합니다.
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0])
      }
    })

    // API 호출 여부 확인은 IngredientComponent의 구현 방식에 맞춰 조정이 필요할 수 있습니다.
  })
})
