//=========================
// Imports (임포트 섹션)
// 테스트에 필요한 라이브러리, 컴포넌트, API 함수들을 불러옵니다.
//=========================
import { render, screen, waitFor } from '@testing-library/react'; // React 컴포넌트 테스트를 위한 렌더링 및 유틸리티
import userEvent from '@testing-library/user-event'; // 사용자 이벤트를 실제 브라우저와 유사하게 시뮬레이션
import { vi, describe, it, expect, beforeEach } from 'vitest'; // Vitest 테스트 프레임워크 기능
import RecipesPage from './page'; // 테스트 대상인 레시피 목록 페이지 컴포넌트
import { getAllRecipes } from '@/api/recipeApi'; // 레시피 목록 조회를 위한 API 함수

//=========================
// Mocks (모킹 섹션)
// 실제 서버나 라우팅 라이브러리 대신 가짜(Mock) 객체를 사용하여 테스트 환경을 독립시킵니다.
//=========================

// API 모듈 모킹: 레시피 목록을 가져오는 함수를 가짜로 대체합니다.
vi.mock('@/api/recipeApi', () => ({
    getAllRecipes: vi.fn(),
}));

// next/navigation 모킹: Next.js의 라우터 기능을 시뮬레이션하여 페이지 이동 여부를 확인합니다.
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush, // 특정 경로로 이동했는지 확인하기 위한 mock 함수
    }),
}));

// 레이아웃 컴포넌트 모킹: 복잡한 레이아웃 의존성을 제거하고 렌더링 효율을 높입니다.
vi.mock('@/components/layout/private/PrivateLayout', () => ({
    default: ({ children }) => <div data-testid="private-layout">{children}</div>,
}));

//=========================
// Mock Data (테스트 데이터 섹션)
// 테스트 중에 API 응답으로 사용할 가짜 레시피 데이터 리스트입니다.
//=========================
const mockRecipes = [
    {
        recipeId: 1,
        title: '맛있는 김치찌개',
        cookTimeText: '30분',
        summary: '매콤하고 시원한 김치찌개',
        thumbnailUrl: '/test-image1.jpg',
    },
    {
        recipeId: 2,
        title: '고소한 된장찌개',
        cookTimeText: '25분',
        summary: '구수한 맛이 일품인 된장찌개',
        thumbnailUrl: '/test-image2.jpg',
    },
];

//=========================
// Test Suite (테스트 스위트 섹션)
// 레시피 목록 페이지의 핵심 기능들을 검증하는 테스트 케이스들의 모음입니다.
//=========================
describe('RecipesPage (레시피 목록 페이지)', () => {
    
    // 각 테스트 케이스가 실행되기 전에 모킹 정보를 초기화합니다.
    beforeEach(() => {
        vi.clearAllMocks(); // 이전 테스트에서의 호출 기록을 삭제합니다.
    });

    // 1. 페이지 렌더링 및 데이터 로딩 검증
    it('페이지가 정상적으로 렌더링되고 레시피 목록을 불러온다', async () => {
        // API가 위에서 정의한 가짜 데이터(mockRecipes)를 반환하도록 설정합니다.
        getAllRecipes.mockResolvedValue(mockRecipes);

        render(<RecipesPage />);

        // 커스텀 레이아웃이 화면에 나타나는지 확인합니다.
        expect(screen.getByTestId('private-layout')).toBeInTheDocument();

        // 비동기적으로 데이터가 로드되어 레시피 제목들이 화면에 표시될 때까지 기다립니다.
        await waitFor(() => {
            expect(screen.getByText('맛있는 김치찌개')).toBeInTheDocument();
            expect(screen.getByText('고소한 된장찌개')).toBeInTheDocument();
        });

        // API 호출 함수가 정확히 한 번 실행되었는지 검증합니다.
        expect(getAllRecipes).toHaveBeenCalledTimes(1);
    });

    // 2. 레시피 카드 내 정보 표시 검증
    it('레시피의 소요 시간과 요약 내용이 올바르게 표시된다', async () => {
        getAllRecipes.mockResolvedValue([mockRecipes[0]]); // 하나의 레시피만 반환하도록 설정

        render(<RecipesPage />);

        await waitFor(() => {
            // Recipe 컴포넌트의 텍스트 구성(소요 시간, 요약 정보)이 정확한지 확인합니다.
            expect(screen.getByText(/소요 시간: 30분/)).toBeInTheDocument();
            expect(screen.getByText(/매콤하고 시원한 김치찌개/)).toBeInTheDocument();
        });
    });

    // 3. 상세 페이지 이동 기능 검증
    it('레시피 보기 버튼 클릭 시 상세 페이지로 이동한다', async () => {
        const user = userEvent.setup(); // 사용자 상호작용 설정을 생성합니다.
        getAllRecipes.mockResolvedValue([mockRecipes[0]]);

        render(<RecipesPage />);

        // 버튼이 나타날 때까지 기다린 후 요소를 찾습니다.
        await waitFor(() => {
            expect(screen.getByText('레시피 보기')).toBeInTheDocument();
        });

        // 사용자가 '레시피 보기' 버튼을 클릭하는 상황을 시뮬레이션합니다.
        const viewButton = screen.getByText('레시피 보기');
        await user.click(viewButton);

        // 클릭 결과로 router.push가 올바른 경로(/recipes/1)로 호출되었는지 검증합니다.
        expect(mockPush).toHaveBeenCalledWith('/recipes/1');
    });

    // 4. 데이터가 없는 경우의 예외 상황 검증
    it('레시피가 없을 경우 빈 화면을 유지한다', async () => {
        getAllRecipes.mockResolvedValue([]); // 빈 배열 반환 설정

        render(<RecipesPage />);

        await waitFor(() => {
            // 화면에 레시피 카드(레시피 보기 버튼 포함)가 렌더링되지 않았는지 확인합니다.
            expect(screen.queryByText('레시피 보기')).not.toBeInTheDocument();
        });

        // 목록 조회 API는 여전히 한 번 호출되어야 합니다.
        expect(getAllRecipes).toHaveBeenCalledTimes(1);
    });
});
