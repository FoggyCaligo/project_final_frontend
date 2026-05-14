import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginButton from '@/components/layout/public/LoginButton';

// Next.js 라우터 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  usePathname: jest.fn(() => '/'),
}));

// AuthContext 모킹
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// API 모킹
jest.mock('@/api/authApi', () => ({
  loginApi: jest.fn(),
}));

// LogoutButton 모킹: 인증 상태일 때 LoginButton이 LogoutButton을 렌더링하므로 단순화
jest.mock('@/components/layout/private/LogoutButton', () => ({
  __esModule: true,
  default: () => <div data-testid="logout-button">LogoutButton</div>,
}));

const { useAuth } = require('@/context/AuthContext');
const { loginApi } = require('@/api/authApi');

// 인증되지 않은 상태로 렌더링하는 헬퍼
const setupGuest = () => {
  const mockLogin = jest.fn();
  useAuth.mockReturnValue({ user: null, login: mockLogin });
  return { mockLogin, user: userEvent.setup() };
};

describe('LoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== 렌더링 분기 =====

  test('user가 null이면 로그인 버튼을 렌더링한다', () => {
    useAuth.mockReturnValue({ user: null, login: jest.fn() });

    render(<LoginButton />);

    expect(screen.getByText('로그인')).toBeInTheDocument();
  });

  test('user가 있으면 LogoutButton을 렌더링한다', () => {
    useAuth.mockReturnValue({
      user: { loginId: 'testuser1', loginType: 'general' },
      login: jest.fn(),
    });

    render(<LoginButton />);

    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByText('로그인')).not.toBeInTheDocument();
  });

  // ===== 모달 열기/닫기 =====

  test('로그인 버튼 클릭 시 모달이 열린다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));

    expect(screen.getByPlaceholderText('아이디')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
  });

  test('모달 닫기 버튼(×) 클릭 시 모달이 닫힌다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    await user.click(screen.getByLabelText('모달 닫기'));

    expect(screen.queryByPlaceholderText('아이디')).not.toBeInTheDocument();
  });

  // ===== 로그인 =====

  test('아이디/비밀번호 미입력 시 에러 메시지를 표시한다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    // 모달 내 로그인 버튼 클릭 (버튼 텍스트 '로그인'이 여러개이므로 last 선택)
    const loginButtons = screen.getAllByText('로그인');
    const submitButton = loginButtons[loginButtons.length - 1];
    await user.click(submitButton);

    expect(screen.getByText('아이디와 비밀번호를 입력해주세요.')).toBeInTheDocument();
  });

  test('로그인 성공 시 login()을 호출하고 모달을 닫는다', async () => {
    const { user, mockLogin } = setupGuest();
    loginApi.mockResolvedValue({ data: { success: true } });
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    await user.type(screen.getByPlaceholderText('아이디'), 'testuser1');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'Test1234!');
    const loginButtons = screen.getAllByText('로그인');
    await user.click(loginButtons[loginButtons.length - 1]);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser1', 'general');
      expect(screen.queryByPlaceholderText('아이디')).not.toBeInTheDocument();
    });
  });

  test('로그인 실패 시 에러 메시지를 표시한다', async () => {
    const { user } = setupGuest();
    loginApi.mockRejectedValue({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    await user.type(screen.getByPlaceholderText('아이디'), 'testuser1');
    await user.type(screen.getByPlaceholderText('비밀번호'), 'wrong');
    const loginButtons = screen.getAllByText('로그인');
    await user.click(loginButtons[loginButtons.length - 1]);

    await waitFor(() => {
      expect(
        screen.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')
      ).toBeInTheDocument();
    });
  });

  // ===== 회원가입 링크 =====

  test('로그인 모달에 /signup으로 이동하는 회원가입 링크가 표시된다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));

    const signupLink = screen.getByRole('link', { name: '회원가입' });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  test('회원가입 링크 클릭 시 모달이 닫힌다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    expect(screen.getByPlaceholderText('아이디')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '회원가입' }));

    expect(screen.queryByPlaceholderText('아이디')).not.toBeInTheDocument();
  });
});
