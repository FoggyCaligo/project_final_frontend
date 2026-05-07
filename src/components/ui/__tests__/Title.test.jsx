import { render, screen } from '@testing-library/react';
import Title from '../Title';

describe('Title', () => {
  it('renders title with default tag and class', () => {
    render(<Title>메인 제목</Title>);

    const el = screen.getByText('메인 제목');
    expect(el.tagName).toBe('H2');
    expect(el).toHaveClass('text-lg', 'font-bold');
    expect(el).toHaveStyle('color: var(--text-main)');
  });
});
