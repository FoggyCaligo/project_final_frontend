import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Next.js 라우터 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
  usePathname: jest.fn(() => '/'),
}));

// getMeApi 모킹 (login()이 내부적으로 호출)
jest.mock('@/api/authApi', () => ({
  getMeApi: jest.fn().mockResolvedValue({ loginId: 'testuser1', nickname: 'testuser1', userId: 1 }),
}));

// AuthContext를 소비하는 테스트용 컴포넌트
function TestConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loginId">{user?.loginId ?? ''}</span>
      <span data-testid="loginType">{user?.loginType ?? ''}</span>
      <button onClick={() => login('testuser1', 'general')}>login-general</button>
      <button onClick={() => login('kakaouser', 'kakao')}>login-kakao</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

const setup = () =>
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // ===== 초기 상태 =====

  test('초기 user 상태는 null이다 (sessionStorage 비어있을 때)', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByTestId('loginId')).toHaveTextContent('');
      expect(screen.getByTestId('loginType')).toHaveTextContent('');
    });
  });

  // ===== login =====

  test('login() 호출 시 user가 loginId와 loginType으로 설정된다', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByText('login-general'));

    await waitFor(() => {
      expect(screen.getByTestId('loginId')).toHaveTextContent('testuser1');
      expect(screen.getByTestId('loginType')).toHaveTextContent('general');
    });
  });

  test('login() 호출 시 sessionStorage에 authUser가 저장된다', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByText('login-general'));

    await waitFor(() => {
      const stored = JSON.parse(sessionStorage.getItem('authUser'));
      expect(stored).toMatchObject({ loginId: 'testuser1', loginType: 'general' });
    });
  });

  test('login() 호출 시 kakao 타입으로도 저장된다', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByText('login-kakao'));

    await waitFor(() => {
      expect(screen.getByTestId('loginType')).toHaveTextContent('kakao');
      const stored = JSON.parse(sessionStorage.getItem('authUser'));
      expect(stored.loginType).toBe('kakao');
    });
  });

  // ===== logout =====

  test('logout() 호출 시 user가 null로 초기화된다', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByText('login-general'));
    await user.click(screen.getByText('logout'));

    expect(screen.getByTestId('loginId')).toHaveTextContent('');
  });

  test('logout() 호출 시 sessionStorage의 authUser가 제거된다', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByText('login-general'));
    await waitFor(() => expect(sessionStorage.getItem('authUser')).not.toBeNull());
    await user.click(screen.getByText('logout'));

    expect(sessionStorage.getItem('authUser')).toBeNull();
  });

  // ===== 새로고침 복원 =====

  test('마운트 시 sessionStorage에 저장된 user를 복원한다', async () => {
    sessionStorage.setItem(
      'authUser',
      JSON.stringify({ loginId: 'restored', loginType: 'general' })
    );

    setup();

    await waitFor(() => {
      expect(screen.getByTestId('loginId')).toHaveTextContent('restored');
      expect(screen.getByTestId('loginType')).toHaveTextContent('general');
    });
  });

  test('sessionStorage에 잘못된 JSON이 있으면 null 상태로 시작하고 항목을 제거한다', async () => {
    sessionStorage.setItem('authUser', 'invalid-json{{{');

    setup();

    await waitFor(() => {
      expect(screen.getByTestId('loginId')).toHaveTextContent('');
    });
    expect(sessionStorage.getItem('authUser')).toBeNull();
  });
});
