"use client";

import Link from "next/link";
import Modal from "@/components/ui/Modal";

const toneClassMap = {
  danger: "badge-danger",
  warning: "badge-warning",
};

export default function DashboardNoticeModal({ notices, isOpen, onClose }) {
  if (!notices.length) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="냉장고 알림"
      description="지금 먼저 확인하면 좋은 냉장고 상태입니다."
      onClose={onClose}
      showFooter={false}
    >
      <div className="flex flex-col gap-3">
        {notices.map((notice) => (
          <div
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4"
            key={notice.id}
          >
            <span className={`badge ${toneClassMap[notice.tone] ?? ""}`}>
              {notice.label}
            </span>
            <strong className="mt-3 block text-[var(--color-text)]">
              {notice.title}
            </strong>
            <p className="card-desc mt-2 text-sm">{notice.message}</p>

            {notice.href && notice.actionLabel && (
              <Link
                className="btn btn-outline mt-4 px-4 py-2 text-sm"
                href={notice.href}
                onClick={onClose}
              >
                {notice.actionLabel}
              </Link>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
