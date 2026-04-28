import { loginApi, logoutApi, signupApi, checkLoginIdApi, getMeApi, findLoginIdApi } from '@/api/authApi';
import api from '@/config/axios';

jest.mock('@/config/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== loginApi =====

  test('loginApi: POST /v1/auth/login 에 loginId와 password를 전송한다', async () => {
    api.post.mockResolvedValue({ data: { success: true, data: null } });

    await loginApi('testuser1', 'Test1234!');

    expect(api.post).toHaveBeenCalledWith('/v1/auth/login', {
      loginId: 'testuser1',
      password: 'Test1234!',
    });
  });

  test('loginApi: 서버 에러 발생 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '아이디 또는 비밀번호가 올바르지 않습니다.', status: 401 };
    api.post.mockRejectedValue(error);

    await expect(loginApi('testuser1', 'wrong')).rejects.toEqual(error);
  });

  // ===== logoutApi =====

  test('logoutApi: POST /v1/auth/logout 을 호출한다', async () => {
    api.post.mockResolvedValue({ data: { success: true, data: null } });

    await logoutApi();

    expect(api.post).toHaveBeenCalledWith('/v1/auth/logout');
  });

  // ===== signupApi (경로 변경: /v1/users/signup → /v1/auth/signup) =====

  test('signupApi: POST /v1/auth/signup 에 모든 필드를 전송한다', async () => {
    api.post.mockResolvedValue({ data: { success: true, data: null } });

    await signupApi({
      loginId: 'newuser1',
      email: 'new@example.com',
      password: 'Test1234!',
      nickname: '새유저',
    });

    expect(api.post).toHaveBeenCalledWith('/v1/auth/signup', {
      loginId: 'newuser1',
      email: 'new@example.com',
      password: 'Test1234!',
      nickname: '새유저',
    });
  });

  test('signupApi: 중복 아이디 에러 발생 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '이미 사용 중인 아이디입니다.', status: 409 };
    api.post.mockRejectedValue(error);

    await expect(
      signupApi({ loginId: 'dup', email: 'dup@example.com', password: 'T1!', nickname: '닉' })
    ).rejects.toEqual(error);
  });

  // ===== checkLoginIdApi (신규) =====

  test('checkLoginIdApi: GET /v1/auth/check-login-id 에 loginId를 params로 전송한다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: { available: true } } });

    await checkLoginIdApi('newuser');

    expect(api.get).toHaveBeenCalledWith('/v1/auth/check-login-id', {
      params: { loginId: 'newuser' },
    });
  });

  test('checkLoginIdApi: 이미 존재하는 아이디 시 available:false를 반환한다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: { available: false } } });

    const res = await checkLoginIdApi('existing');

    expect(res.data.data.available).toBe(false);
  });

  // ===== getMeApi (신규) =====

  test('getMeApi: GET /v1/auth/me 를 호출한다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: { loginId: 'testuser1' } } });

    const res = await getMeApi();

    expect(api.get).toHaveBeenCalledWith('/v1/auth/me');
    expect(res.data.data.loginId).toBe('testuser1');
  });

  test('getMeApi: 인증 없이 호출 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '인증이 필요합니다.', status: 401 };
    api.get.mockRejectedValue(error);

    await expect(getMeApi()).rejects.toEqual(error);
  });

  // ===== findLoginIdApi =====

  test('findLoginIdApi: GET /v1/users/find-loginid 에 email을 params로 전송한다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: 'testuser1' } });

    await findLoginIdApi('test@example.com');

    expect(api.get).toHaveBeenCalledWith('/v1/users/find-loginid', {
      params: { email: 'test@example.com' },
    });
  });

  test('findLoginIdApi: 존재하지 않는 이메일 에러 발생 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '사용자를 찾을 수 없습니다.', status: 404 };
    api.get.mockRejectedValue(error);

    await expect(findLoginIdApi('nobody@example.com')).rejects.toEqual(error);
  });
});
