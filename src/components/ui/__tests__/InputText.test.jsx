import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputText from '../InputText';

describe('InputText', () => {
  it('renders controlled value and calls getText on change', async () => {
    const user = userEvent.setup();
    const getText = vi.fn();

    render(
      <InputText
        setText="기존값"
        getText={getText}
        placeholder="입력"
        is_full="true"
      />
    );

    const input = screen.getByPlaceholderText('입력');
    expect(input).toHaveValue('기존값');
    expect(input).toHaveClass('w-full');

    await user.type(input, 'c');
    expect(getText).toHaveBeenCalled();
    expect(getText).toHaveBeenLastCalledWith('기존값c');
  });
});
