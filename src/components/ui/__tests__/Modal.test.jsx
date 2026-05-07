import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    const { container } = render(<Modal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders and triggers onClose/onConfirm', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <Modal isOpen={true} title="테스트 모달" onClose={onClose} onConfirm={onConfirm}>
        <div>본문</div>
      </Modal>
    );

    expect(screen.getByText('테스트 모달')).toBeInTheDocument();
    expect(screen.getByText('본문')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    fireEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });
});
