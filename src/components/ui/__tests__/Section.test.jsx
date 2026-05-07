import { render, screen } from '@testing-library/react';
import Section from '../Section';

describe('Section', () => {
  it('wraps children with section and inner container classes', () => {
    const { container } = render(
      <Section>
        <div>내용</div>
      </Section>
    );

    expect(screen.getByText('내용')).toBeInTheDocument();
    const section = container.querySelector('section');
    const inner = container.querySelector('section > div');
    expect(section).toHaveClass('py-20');
    expect(inner).toHaveClass('mx-auto', 'w-full', 'max-w-6xl');
  });
});
