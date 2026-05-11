import { render, screen } from '@testing-library/react';
import CustomTag from '../Tag';

describe('CustomTag', () => {
  it('renders tag text and variant class', () => {
    render(<CustomTag variant="primary">태그</CustomTag>);

    const el = screen.getByText('태그');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('themePrimary');
  });
});
