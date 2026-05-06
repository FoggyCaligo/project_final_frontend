import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CommunityDetailPage from '../page'
import { 
    getPostDetail, addPostLike, removePostLike, getPostLikeStatus, 
    addPostReport, getPostReportStatus, addFollow, removeFollow, checkFollowStatus 
} from '@/api/postApi'
import { addBookmark, removeBookmark, checkBookmarkStatus } from '@/api/bookmarkApi'

// 1. 라우터 및 파라미터 모킹
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    useParams: () => ({ postId: '100' })
}))

// 2. API 모킹
vi.mock('@/api/postApi', () => ({
    getPostDetail: vi.fn(),
    deletePost: vi.fn(),
    addPostLike: vi.fn(),
    removePostLike: vi.fn(),
    getPostLikeStatus: vi.fn(),
    addPostReport: vi.fn(),
    getPostReportStatus: vi.fn(),
    addFollow: vi.fn(),
    removeFollow: vi.fn(),
    checkFollowStatus: vi.fn()
}))

vi.mock('@/api/bookmarkApi', () => ({
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    checkBookmarkStatus: vi.fn()
}))

describe('CommunityDetailPage (상호작용 테스트)', () => {
    // 💡 테스트 가정: 
    // - 접속한 유저(currentUserId) = 2
    // - 화면에 보이는 게시글 작성자(authorUserId) = 1 (타인의 글)
    
    const mockPost = {
        postId: 100,
        title: 'User 1이 작성한 레시피',
        content: '테스트 내용입니다.',
        authorUserId: 1,  // 타인(User 1)
        authorLoginId: 'user1',
        recipeId: 50,
        createdAt: '2026-05-06T12:00:00'
    }

    beforeEach(() => {
        vi.clearAllMocks()

        // window.confirm 모킹 (기본적으로 true 반환하여 신고/삭제 진행)
        vi.stubGlobal('confirm', vi.fn(() => true))
        vi.stubGlobal('alert', vi.fn())

        // 기본 API 응답 세팅 (초기 상태: 아무것도 누르지 않음)
        getPostDetail.mockResolvedValue(mockPost)
        getPostLikeStatus.mockResolvedValue({ isLiked: false, likeCount: 10 })
        getPostReportStatus.mockResolvedValue({ isReported: false })
        checkFollowStatus.mockResolvedValue({ isFollowing: false })
        checkBookmarkStatus.mockResolvedValue({ isBookmarked: false })
    })

    it('타인의 게시글 진입 시 상호작용(좋아요, 팔로우 등) 버튼들이 렌더링된다', async () => {
        render(<CommunityDetailPage />)

        await waitFor(() => {
            expect(screen.getByText('User 1이 작성한 레시피')).toBeInTheDocument()
        })

        // 타인의 글이므로 수정/삭제 버튼은 없고 상호작용 버튼만 존재해야 함
        expect(screen.getByText(/좋아요 10/i)).toBeInTheDocument()
        expect(screen.getByText('팔로우')).toBeInTheDocument()
        expect(screen.getByText('북마크')).toBeInTheDocument()
        expect(screen.getByText('신고하기')).toBeInTheDocument()
    })

    it('좋아요 버튼 클릭 시 addPostLike API가 호출되고 상태가 변경된다', async () => {
        render(<CommunityDetailPage />)
        
        await waitFor(() => screen.getByText(/좋아요 10/i))
        const likeButton = screen.getByText(/좋아요 10/i)

        // API 성공 모킹
        addPostLike.mockResolvedValue({ success: true })

        fireEvent.click(likeButton)

        // Optimistic UI 반영 확인 (10 -> 11)
        expect(screen.getByText(/좋아요 11/i)).toBeInTheDocument()
        
        // 💡 API 호출 검증: postId = '100', userId(행위자) = 2
        expect(addPostLike).toHaveBeenCalledWith('100', 2)
    })

    it('팔로우 버튼 클릭 시 addFollow API가 호출되고 텍스트가 변경된다', async () => {
        render(<CommunityDetailPage />)
        
        await waitFor(() => screen.getByText('팔로우'))
        const followButton = screen.getByText('팔로우')

        addFollow.mockResolvedValue({ success: true })

        fireEvent.click(followButton)

        await waitFor(() => {
            expect(screen.getByText('팔로잉')).toBeInTheDocument()
        })
        
        // 💡 API 호출 검증: followeeId(대상자) = 1, followerId(행위자) = 2
        expect(addFollow).toHaveBeenCalledWith(1, 2)
    })

    it('북마크 버튼 클릭 시 addBookmark API가 호출된다', async () => {
        render(<CommunityDetailPage />)
        
        await waitFor(() => screen.getByText('북마크'))
        const bookmarkButton = screen.getByText('북마크')

        addBookmark.mockResolvedValue({ success: true })

        fireEvent.click(bookmarkButton)

        await waitFor(() => {
            expect(screen.getByText('북마크 됨')).toBeInTheDocument()
        })
        
        // 💡 API 호출 검증: userId(행위자) = 2, recipeId = 50
        expect(addBookmark).toHaveBeenCalledWith(2, 50)
    })

    it('신고하기 버튼 클릭 시 확인 창을 거쳐 addPostReport API가 호출되고 목록으로 이동한다', async () => {
        render(<CommunityDetailPage />)
        
        await waitFor(() => screen.getByText('신고하기'))
        const reportButton = screen.getByText('신고하기')

        addPostReport.mockResolvedValue({ success: true })

        fireEvent.click(reportButton)

        // window.confirm 호출 여부
        expect(window.confirm).toHaveBeenCalledWith('정말 이 게시글을 신고하시겠습니까?')

        await waitFor(() => {
            // 💡 API 호출 검증: postId = '100', userId(행위자) = 2
            expect(addPostReport).toHaveBeenCalledWith('100', 2)
            
            // 성공 후 알림 및 페이지 이동 검증
            expect(window.alert).toHaveBeenCalledWith('신고가 접수되었습니다.')
            expect(mockPush).toHaveBeenCalledWith('/community')
        })
    })

    it('이미 신고한 글인 경우 다시 누르면 경고창만 띄운다', async () => {
        // 이미 신고 상태라고 모킹
        getPostReportStatus.mockResolvedValue({ isReported: true })
        
        render(<CommunityDetailPage />)
        
        await waitFor(() => screen.getByText('신고됨'))
        const reportedButton = screen.getByText('신고됨')

        fireEvent.click(reportedButton)

        // API를 다시 호출하지 않고 alert만 띄워야 함
        expect(window.alert).toHaveBeenCalledWith('이미 검토중인 글입니다.')
        expect(addPostReport).not.toHaveBeenCalled()
    })
})