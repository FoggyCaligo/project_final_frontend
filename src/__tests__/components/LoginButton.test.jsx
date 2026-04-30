import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginButton from '@/components/layout/public/LoginButton';

// AuthContext 모킹
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// API 모킹
jest.mock('@/api/authApi', () => ({
  loginApi: jest.fn(),
  signupApi: jest.fn(),
}));

// LogoutButton 모킹: 인증 상태일 때 LoginButton이 LogoutButton을 렌더링하므로 단순화
jest.mock('@/components/layout/private/LogoutButton', () => ({
  __esModule: true,
  default: () => <div data-testid="logout-button">LogoutButton</div>,
}));

const { useAuth } = require('@/context/AuthContext');
const { loginApi, signupApi } = require('@/api/authApi');

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

  // ===== 탭 전환 =====

  test('회원가입 탭 클릭 시 회원가입 폼이 표시된다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    // 탭 버튼(로그인/회원가입) 중 회원가입 탭 선택
    const signupTab = screen.getAllByText('회원가입')[0];
    await user.click(signupTab);

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('닉네임 (2~20자)')).toBeInTheDocument();
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

  // ===== 회원가입 =====

  test('회원가입 폼 미입력 시 에러 메시지를 표시한다', async () => {
    const { user } = setupGuest();
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    const signupTab = screen.getAllByText('회원가입')[0];
    await user.click(signupTab);
    await user.click(screen.getByText('회원가입', { selector: 'button[type="button"]' }));

    await waitFor(() => {
      expect(screen.getByText('모든 항목을 입력해주세요.')).toBeInTheDocument();
    });
  });

  test('회원가입 성공 시 로그인 탭으로 전환되고 완료 메시지를 표시한다', async () => {
    const { user } = setupGuest();
    signupApi.mockResolvedValue({ data: { success: true } });
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    const signupTab = screen.getAllByText('회원가입')[0];
    await user.click(signupTab);

    await user.type(screen.getByPlaceholderText('아이디 (4~20자, 영문/숫자/_)'), 'newuser1');
    await user.type(screen.getByPlaceholderText('이메일'), 'new@example.com');
    await user.type(screen.getByPlaceholderText('비밀번호 (8자 이상, 영문+숫자+특수문자)'), 'Test1234!');
    await user.type(screen.getByPlaceholderText('닉네임 (2~20자)'), '새유저');
    await user.click(screen.getByText('회원가입', { selector: 'button[type="button"]' }));

    await waitFor(() => {
      expect(screen.getByText('회원가입이 완료되었습니다. 로그인해주세요.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('아이디')).toBeInTheDocument(); // 로그인 탭으로 전환
    });
  });

  test('회원가입 실패 시 에러 메시지를 표시한다', async () => {
    const { user } = setupGuest();
    signupApi.mockRejectedValue({ message: '이미 사용 중인 아이디입니다.' });
    render(<LoginButton />);

    await user.click(screen.getByText('로그인'));
    const signupTab = screen.getAllByText('회원가입')[0];
    await user.click(signupTab);

    await user.type(screen.getByPlaceholderText('아이디 (4~20자, 영문/숫자/_)'), 'dupuser');
    await user.type(screen.getByPlaceholderText('이메일'), 'dup@example.com');
    await user.type(screen.getByPlaceholderText('비밀번호 (8자 이상, 영문+숫자+특수문자)'), 'Test1234!');
    await user.type(screen.getByPlaceholderText('닉네임 (2~20자)'), '중복');
    await user.click(screen.getByText('회원가입', { selector: 'button[type="button"]' }));

    await waitFor(() => {
      expect(screen.getByText('이미 사용 중인 아이디입니다.')).toBeInTheDocument();
    });
  });
});
