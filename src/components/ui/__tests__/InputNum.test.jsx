import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputNum from '../InputNum';

describe('InputNum', () => {
  it('renders numeric input and forwards input text', async () => {
    const user = userEvent.setup();
    const getText = vi.fn();

    render(<InputNum getText={getText} placeholder="숫자" />);

    const input = screen.getByPlaceholderText('숫자');
    expect(input).toHaveAttribute('type', 'num');

    await user.type(input, '12');
    expect(getText).toHaveBeenLastCalledWith('12');
  });
});
