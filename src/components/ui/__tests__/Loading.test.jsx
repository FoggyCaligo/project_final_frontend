import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<Loading isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders loading text and locks body scroll when open', () => {
    render(<Loading isOpen={true} text="로딩중" />);

    expect(screen.getByText('로딩중')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });
});
