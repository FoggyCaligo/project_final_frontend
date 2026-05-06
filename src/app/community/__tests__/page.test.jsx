import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CommunityPage from '../page'
import { getAllPosts } from '@/api/postApi'
import { useRouter } from 'next/navigation'

// 1. API 모킹
vi.mock('@/api/postApi', () => ({
  getAllPosts: vi.fn(),
}))

// 2. Next.js 라우터 모킹
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

// 3. 외부 컴포넌트 모킹 (필요시)
vi.mock('@/components/layout/private/PrivateLayout', () => ({
  default: ({ children }) => <div data-testid="private-layout">{children}</div>
}))

describe('CommunityPage', () => {
  const mockPush = vi.fn()

  // 모의 게시글 데이터
  const mockPosts = [
    {
      postId: 100,
      title: '맛있는 김치찌개 레시피 후기',
      desc: '정말 맛있게 먹었습니다!',
      author: 'user1',
      date: '2026-05-06T09:00:00',
      storagePath: '/path/to',
      storedName: 'image1.jpg'
    },
    {
      postId: 101,
      title: '계란말이 꿀팁 공유',
      desc: '우유를 조금 넣으면 부드러워요.',
      author: 'user2',
      date: '2026-05-06T10:00:00',
      storagePath: '/path/to',
      storedName: 'image2.jpg'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // useRouter 반환값 설정
    useRouter.mockReturnValue({ push: mockPush })

    // 기본 API 응답 설정 (Spring Boot의 Page 객체 형태 또는 List 형태 가정)
    getAllPosts.mockResolvedValue({ 
        data: mockPosts,
        totalPages: 1,
        totalElements: 2
    })
  })

  it('페이지 진입 시 게시글 목록을 불러와서 렌더링한다', async () => {
    render(<CommunityPage />)

    // 페이지 타이틀 확인 (페이지 구현에 맞춰 텍스트 수정 가능)
    expect(screen.getByText('커뮤니티')).toBeInTheDocument()

    // 데이터 렌더링 확인 (waitFor 사용)
    await waitFor(() => {
      expect(screen.getByText('맛있는 김치찌개 레시피 후기')).toBeInTheDocument()
      expect(screen.getByText('계란말이 꿀팁 공유')).toBeInTheDocument()
      expect(screen.getByText('user1')).toBeInTheDocument()
    })
  })

  it('글쓰기 버튼 클릭 시 등록 페이지(/community/register)로 이동한다', async () => {
    render(<CommunityPage />)
    
    // 렌더링 대기
    await waitFor(() => {
      expect(screen.getByText('맛있는 김치찌개 레시피 후기')).toBeInTheDocument()
    })
    
    // 글쓰기 버튼 클릭
    const writeButton = screen.getByText('글쓰기')
    fireEvent.click(writeButton)

    // 라우터 push 호출 검증
    expect(mockPush).toHaveBeenCalledWith('/community/register')
  })

  it('게시글 클릭 시 상세 페이지(/community/detail/{postId})로 이동한다', async () => {
    render(<CommunityPage />)

    // 렌더링 대기
    await waitFor(() => {
      expect(screen.getByText('맛있는 김치찌개 레시피 후기')).toBeInTheDocument()
    })

    // 특정 게시글(PostCard) 클릭
    const postTitle = screen.getByText('맛있는 김치찌개 레시피 후기')
    fireEvent.click(postTitle)

    // 해당 게시글의 postId를 포함한 경로로 push 되었는지 검증
    expect(mockPush).toHaveBeenCalledWith('/community/detail/100')
  })
  
  it('게시글이 없을 경우 빈 상태 메시지를 렌더링한다', async () => {
    // API 응답을 빈 배열로 덮어쓰기
    getAllPosts.mockResolvedValue({ data: [], totalElements: 0 })
    
    render(<CommunityPage />)

    await waitFor(() => {
      expect(screen.getByText(/등록된 게시글이 없습니다/i)).toBeInTheDocument()
    })
  })
})