import { render, screen, fireEvent } from '@testing-library/react';
import InputDate from '../InputDate';

vi.mock('antd', () => ({
  DatePicker: ({ placeholder, className, onChange }) => (
    <input
      aria-label="date-picker"
      placeholder={placeholder}
      className={className}
      onChange={(e) => onChange?.(null, e.target.value)}
    />
  ),
}));

describe('InputDate', () => {
  it('renders placeholder and forwards selected date string', () => {
    const getText = vi.fn();

    render(<InputDate getText={getText} placeholder="날짜 선택" is_full="true" />);

    const input = screen.getByLabelText('date-picker');
    expect(input).toHaveAttribute('placeholder', '날짜 선택');
    expect(input).toHaveClass('w-full');

    fireEvent.change(input, { target: { value: '2026-05-07' } });
    expect(getText).toHaveBeenCalledWith('2026-05-07');
  });
});
