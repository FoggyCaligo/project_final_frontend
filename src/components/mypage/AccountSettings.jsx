import { accountSettingItems } from "@/features/mypage/constants";

const toneClassMap = {
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
};

export default function AccountSettings() {
  return (
    <article className="card-box">
      <div className="card-body">
        <h2 className="card-title">계정 설정</h2>
        <p className="card-desc">
          로그인한 회원의 프로필과 계정 관련 상태를 확인합니다.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {accountSettingItems.map((item) => (
            <div
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4"
              key={item.id}
            >
              <div>
                <strong className="text-[var(--color-text)]">{item.label}</strong>
                <p className="card-desc mt-1 text-sm">{item.desc}</p>
              </div>
              <span className={`badge ${toneClassMap[item.tone] ?? ""}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
