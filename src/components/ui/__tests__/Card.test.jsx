import React from 'react';
import { render } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  test('renders card with correct base classes', () => {
    const { container } = render(
      <Card>
        <div>Test Content</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass('rounded-3xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('p-8');
    expect(card).toHaveClass('m-4');
    expect(card).toHaveClass('shadow-[0_8px_30px_rgba(120,90,60,0.08)]');
  });

  test('renders children content', () => {
    const { getByText } = render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    
    const content = getByText('Test Content');
    expect(content).toBeInTheDocument();
  });

  test('applies custom style when provided', () => {
    const customStyle = { backgroundColor: 'red', padding: '20px' };
    const { container } = render(
      <Card style={customStyle}>
        <div>Test Content</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveStyle('background-color: rgb(255, 0, 0)');
    expect(card).toHaveStyle('padding: 20px');
  });

  test('applies CSS variables for background and border', () => {
    const { container } = render(
      <Card>
        <div>Test Content</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveStyle('background-color: var(--card-bg)');
    expect(card).toHaveStyle('border-color: var(--border)');
  });

  test('renders with correct structure', () => {
    const { container } = render(
      <Card>
        <h1>Card Title</h1>
        <p>Card Content</p>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toBeInTheDocument();
    expect(card).toContainElement(card.querySelector('h1'));
    expect(card).toContainElement(card.querySelector('p'));
  });

  test('handles empty children', () => {
    const { container } = render(
      <Card>
        {/* Empty content */}
      </Card>
    );

    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });
});
