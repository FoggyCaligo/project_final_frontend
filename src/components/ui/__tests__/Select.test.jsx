import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../Select';

describe('Select', () => {
  const options = [
    { label: '사과', value: 'apple' },
    { label: '바나나', value: 'banana' },
  ];

  it('opens dropdown and selects an option', () => {
    const getText = vi.fn();

    render(
      <Select
        options={options}
        getText={getText}
        placeholder="선택하세요"
        is_full="true"
      />
    );

    fireEvent.click(screen.getByText('선택하세요'));
    fireEvent.click(screen.getByText('바나나'));

    expect(getText).toHaveBeenCalledWith('banana');
    expect(screen.getByText('바나나')).toBeInTheDocument();
  });
});
