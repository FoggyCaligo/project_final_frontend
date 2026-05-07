import { render, screen } from '@testing-library/react';
import Recipe from '../Recipe';

vi.mock('@/api/bookmarkApi', () => ({
  addBookmark: vi.fn(),
  removeBookmark: vi.fn(),
  checkBookmarkStatus: vi.fn(),
}));

vi.mock('@/api/authApi', () => ({
  getMeApi: vi.fn(),
  user: null,
}));

describe('Recipe', () => {
  it('renders recipe basics and action button', () => {
    render(
      <Recipe
        name="김치볶음밥"
        time="20분"
        difficulty="쉬움"
        variant="list"
        handleClick={() => {}}
      />
    );

    expect(screen.getByText('김치볶음밥')).toBeInTheDocument();
    expect(screen.getByText(/소요 시간: 20분/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '레시피 보기' })).toBeInTheDocument();
  });
});
