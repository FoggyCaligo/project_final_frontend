import { shoppingApi } from '@/api/shoppingApi';
import api from '@/config/axios';

jest.mock('@/config/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('shoppingApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== searchByKeyword =====

  test('searchByKeyword: GET /v1/shopping/search 에 keyword를 params로 전송한다', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: { ingredientName: '계란', lowestPrice: 2800, items: [] },
      },
    });

    await shoppingApi.searchByKeyword('계란');

    expect(api.get).toHaveBeenCalledWith('/v1/shopping/search', { params: { keyword: '계란' } });
  });

  test('searchByKeyword: 서버 에러 발생 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '서버 오류', status: 500 };
    api.get.mockRejectedValue(error);

    await expect(shoppingApi.searchByKeyword('계란')).rejects.toEqual(error);
  });

  test('searchByKeyword: 빈 문자열 키워드도 그대로 params에 전달된다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: { items: [] } } });

    await shoppingApi.searchByKeyword('');

    expect(api.get).toHaveBeenCalledWith('/v1/shopping/search', { params: { keyword: '' } });
  });

  test('searchByKeyword: 한글 키워드로 요청 시 응답 데이터를 그대로 반환한다', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: { ingredientName: '대파', lowestPrice: 1500, items: [{ mallName: '네이버쇼핑', price: 1500 }] },
      },
    };
    api.get.mockResolvedValue(mockResponse);

    const result = await shoppingApi.searchByKeyword('대파');

    expect(result.data.data.lowestPrice).toBe(1500);
    expect(result.data.data.items).toHaveLength(1);
  });

  // ===== getIngredientPrices =====

  test('getIngredientPrices: GET /v1/shopping/ingredients/:id/prices 를 올바른 경로로 호출한다', async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: { ingredientId: 1, ingredientName: '계란', lowestPrice: 3000 } },
    });

    await shoppingApi.getIngredientPrices(1);

    expect(api.get).toHaveBeenCalledWith('/v1/shopping/ingredients/1/prices');
  });

  test('getIngredientPrices: 다른 ingredientId로 호출해도 올바른 경로를 사용한다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: {} } });

    await shoppingApi.getIngredientPrices(42);

    expect(api.get).toHaveBeenCalledWith('/v1/shopping/ingredients/42/prices');
  });

  test('getIngredientPrices: 인증 에러 발생 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '인증이 필요합니다.', status: 401 };
    api.get.mockRejectedValue(error);

    await expect(shoppingApi.getIngredientPrices(1)).rejects.toEqual(error);
  });

  // ===== getFridgePrices =====

  test('getFridgePrices: GET /v1/shopping/fridge/prices 를 호출한다', async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: [] },
    });

    await shoppingApi.getFridgePrices();

    expect(api.get).toHaveBeenCalledWith('/v1/shopping/fridge/prices');
  });

  test('getFridgePrices: 응답이 배열 형태로 반환된다', async () => {
    const mockItems = [
      { ingredientName: '계란', lowestPrice: 3000 },
      { ingredientName: '대파', lowestPrice: 1500 },
    ];
    api.get.mockResolvedValue({ data: { success: true, data: mockItems } });

    const result = await shoppingApi.getFridgePrices();

    expect(result.data.data).toHaveLength(2);
    expect(result.data.data[0].ingredientName).toBe('계란');
  });

  test('getFridgePrices: 인증 에러 발생 시 reject된 Promise를 반환한다', async () => {
    const error = { message: '로그인이 필요합니다.', status: 401 };
    api.get.mockRejectedValue(error);

    await expect(shoppingApi.getFridgePrices()).rejects.toEqual(error);
  });

  test('getFridgePrices: 냉장고가 비어있을 때 빈 배열을 반환한다', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } });

    const result = await shoppingApi.getFridgePrices();

    expect(result.data.data).toEqual([]);
  });
});
