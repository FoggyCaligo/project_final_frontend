import { accountSettingItems } from "@/features/mypage/constants";

export default function AccountSettings() {
  return (
    <article className="card-box">
      <div className="card-body">
        <h2 className="card-title">계정 설정</h2>
        <p className="card-desc">
          인증 API와 프로필 수정 API가 합쳐지면 바로 연결할 수 있도록 메뉴를 분리했습니다.
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
              <span className="badge">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
