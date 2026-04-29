import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoutButton from '@/components/layout/private/LogoutButton';

// AuthContext 모킹: user 상태와 logout 함수를 외부에서 주입
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// logoutApi 모킹
jest.mock('@/api/authApi', () => ({
  logoutApi: jest.fn(),
}));

const { useAuth } = require('@/context/AuthContext');
const { logoutApi } = require('@/api/authApi');

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== 렌더링 분기 =====

  test('user가 null이면 아무것도 렌더링하지 않는다', () => {
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });

    const { container } = render(<LogoutButton />);

    expect(container).toBeEmptyDOMElement();
  });

  test('loginType이 general이면 loginId 텍스트와 로그아웃 버튼을 렌더링한다', () => {
    useAuth.mockReturnValue({
      user: { loginId: 'testuser1', loginType: 'general' },
      logout: jest.fn(),
    });

    render(<LogoutButton />);

    expect(screen.getByText('testuser1')).toBeInTheDocument();
    expect(screen.getByText('로그아웃')).toBeInTheDocument();
  });

  test('loginType이 kakao이면 카카오 로그아웃 버튼을 렌더링한다', () => {
    useAuth.mockReturnValue({
      user: { loginId: 'kakaouser', loginType: 'kakao' },
      logout: jest.fn(),
    });

    render(<LogoutButton />);

    expect(screen.getByText('카카오 로그아웃')).toBeInTheDocument();
    expect(screen.queryByText('kakaouser')).not.toBeInTheDocument();
  });

  // ===== 로그아웃 동작 =====

  test('로그아웃 버튼 클릭 시 logoutApi를 호출한다', async () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { loginId: 'testuser1', loginType: 'general' },
      logout: mockLogout,
    });
    logoutApi.mockResolvedValue({});
    const user = userEvent.setup();

    render(<LogoutButton />);
    await user.click(screen.getByText('로그아웃'));

    expect(logoutApi).toHaveBeenCalledTimes(1);
  });

  test('로그아웃 버튼 클릭 시 logout()을 호출하여 클라이언트 세션을 초기화한다', async () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { loginId: 'testuser1', loginType: 'general' },
      logout: mockLogout,
    });
    logoutApi.mockResolvedValue({});
    const user = userEvent.setup();

    render(<LogoutButton />);
    await user.click(screen.getByText('로그아웃'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('서버 오류가 발생해도 logout()을 호출하여 클라이언트 세션을 초기화한다', async () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { loginId: 'testuser1', loginType: 'general' },
      logout: mockLogout,
    });
    logoutApi.mockRejectedValue(new Error('서버 오류'));
    const user = userEvent.setup();

    render(<LogoutButton />);
    await user.click(screen.getByText('로그아웃'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('카카오 로그아웃 버튼 클릭 시 logout()을 호출한다', async () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { loginId: 'kakaouser', loginType: 'kakao' },
      logout: mockLogout,
    });
    logoutApi.mockResolvedValue({});
    const user = userEvent.setup();

    render(<LogoutButton />);
    await user.click(screen.getByText('카카오 로그아웃'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
