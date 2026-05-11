import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={() => {}} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('moves to previous/next page via buttons', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '이전' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });
});
