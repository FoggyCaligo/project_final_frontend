import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookMarkButton from '../BookMarkButton';

const mockFn = (...args) => {
  if (globalThis.jest?.fn) return globalThis.jest.fn(...args);
  return globalThis.vi.fn(...args);
};

describe('BookMarkButton', () => {
  it('initialBookmarked 값에 따라 초기 상태를 렌더링한다', () => {
    const { rerender } = render(<BookMarkButton initialBookmarked={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☆');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(<BookMarkButton initialBookmarked={true} />);

    expect(button).toHaveTextContent('★');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('onToggle이 없으면 클릭 시 내부 상태를 토글한다', async () => {
    const user = userEvent.setup();
    render(<BookMarkButton initialBookmarked={false} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toHaveTextContent('★');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('onToggle이 boolean을 반환하면 그 값을 상태로 반영한다', async () => {
    const user = userEvent.setup();
    const onToggle = mockFn().mockResolvedValue(false);

    render(<BookMarkButton initialBookmarked={false} onToggle={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith(true);
      expect(button).toHaveTextContent('☆');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('요청 중에는 비활성화되고 중복 클릭을 막는다', async () => {
    const user = userEvent.setup();

    let resolveToggle;
    const onToggle = mockFn(
      () =>
        new Promise((resolve) => {
          resolveToggle = resolve;
        })
    );

    render(<BookMarkButton initialBookmarked={false} onToggle={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('...');

    await user.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    resolveToggle(true);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('★');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
