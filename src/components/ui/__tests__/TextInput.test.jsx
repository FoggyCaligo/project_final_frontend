import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '../TextInput';

describe('TextInput', () => {
  it('renders text input and calls getText while typing', async () => {
    const user = userEvent.setup();
    const getText = vi.fn();

    render(<TextInput getText={getText} placeholder="텍스트" />);

    const input = screen.getByPlaceholderText('텍스트');
    expect(input).toHaveAttribute('type', 'text');

    await user.type(input, 'hello');
    expect(getText).toHaveBeenLastCalledWith('hello');
  });
});
