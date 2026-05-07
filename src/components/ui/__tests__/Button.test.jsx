import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => { 
  const mockHandleClick = vi.fn();

  beforeEach(() => {
    mockHandleClick.mockClear();
  });

  test('renders button with correct text', () => {
    const { getByText } = render(
      <Button handleClick={mockHandleClick}>
        Test Button
      </Button>
    );
    
    const button = getByText('Test Button');
    expect(button).toBeInTheDocument();
  });

  test('applies primary variant by default', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick}>
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('themePrimary');
  });

  test('applies secondary variant when specified', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick} variant="secondary">
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('themeSecondary');
  });

  test('applies accent variant when specified', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick} variant="accent">
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('themeAccent');
  });

  test('applies square style when is_square is true', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick} is_square={true}>
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('rounded-lg');
  });

  test('applies full width style when is_full is true', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick} is_full={true}>
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  test('calls handleClick when button is clicked', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick}>
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    fireEvent.click(button);
    
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional style when style prop is provided', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick} style="custom-style">
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('custom-style');
  });

  test('renders with correct base classes', () => {
    const { getByRole } = render(
      <Button handleClick={mockHandleClick}>
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-sb');
    expect(button).toHaveClass('font-semibold');
    expect(button).toHaveClass('transition');
    expect(button).toHaveClass('whitespace-nowrap');
  });

  test('handles multiple style combinations', () => {
    const { getByRole } = render(
      <Button 
        handleClick={mockHandleClick} 
        variant="secondary" 
        is_square={true} 
        is_full={true}
      >
        Test Button
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveClass('themeSecondary');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('w-full');
  });
});
