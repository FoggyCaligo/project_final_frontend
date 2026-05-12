"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { accountSettingItems } from "@/features/mypage/constants";

const toneClassMap = {
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
};

export default function AccountSettings({ onPasswordChange }) {
  const [open, setOpen] = useState(false);

  const handlePasswordChange = () => {
    setOpen(false);
    onPasswordChange?.();
  };

  return (
    <>
      <article className="card-box">
        <div className="card-body">
          <h2 className="card-title">계정 설정</h2>
          <p className="card-desc">
            프로필, 개인 조건, 보안 항목은 필요할 때만 열어서 확인합니다.
          </p>
          <div className="card-actions">
            <button className="btn btn-secondary" onClick={() => setOpen(true)} type="button">
              계정 설정 열기
            </button>
          </div>
        </div>
      </article>

      <Modal
        description="계정과 추천 개인화에 연결되는 설정 항목입니다."
        isOpen={open}
        onClose={() => setOpen(false)}
        showFooter={false}
        title="계정 설정"
      >
        <div className="flex flex-col gap-3">
          {accountSettingItems.map((item) => (
            <div
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4"
              key={item.id}
            >
              <div>
                <strong className="text-[var(--color-text)]">{item.label}</strong>
                <p className="card-desc mt-1 text-sm">{item.desc}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`badge ${toneClassMap[item.tone] ?? ""}`}>{item.status}</span>
                {item.id === "security" && (
                  <button
                    className="btn btn-outline px-4 py-2 text-sm"
                    onClick={handlePasswordChange}
                    type="button"
                  >
                    변경
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
