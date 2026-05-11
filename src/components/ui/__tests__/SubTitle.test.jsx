import { render, screen } from '@testing-library/react';
import SubTitle from '../SubTitle';

describe('SubTitle', () => {
  it('renders children and applies color style', () => {
    render(<SubTitle color="red">소제목</SubTitle>);

    const el = screen.getByText('소제목');
    expect(el.tagName).toBe('H2');
    expect(el).toHaveStyle('color: rgb(255, 0, 0)');
    expect(el).toHaveClass('text-sm');
  });
});
